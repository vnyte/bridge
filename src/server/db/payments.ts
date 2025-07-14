import { db } from '@/db';
import { ClientTable, PaymentTable, ClientTransactionTable } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, and, desc, max, or, ilike } from 'drizzle-orm';
import { getCurrentOrganizationBranchId } from '@/server/db/branch';

const _getPayments = async (branchId: string, name?: string, paymentStatus?: string) => {
  const conditions = [eq(ClientTable.branchId, branchId)];

  if (name) {
    conditions.push(
      or(ilike(ClientTable.firstName, `%${name}%`), ilike(ClientTable.lastName, `%${name}%`))!
    );
  }

  // Get all payments with client information and latest transaction details
  const payments = await db
    .select({
      id: PaymentTable.id,
      clientId: PaymentTable.clientId,
      clientFirstName: ClientTable.firstName,
      clientMiddleName: ClientTable.middleName,
      clientLastName: ClientTable.lastName,
      originalAmount: PaymentTable.originalAmount,
      finalAmount: PaymentTable.finalAmount,
      discount: PaymentTable.discount,
      paymentStatus: PaymentTable.paymentStatus,
      paymentType: PaymentTable.paymentType,
      firstInstallmentDate: PaymentTable.firstInstallmentDate,
      firstInstallmentPaid: PaymentTable.firstInstallmentPaid,
      secondInstallmentDate: PaymentTable.secondInstallmentDate,
      secondInstallmentPaid: PaymentTable.secondInstallmentPaid,
      paymentDueDate: PaymentTable.paymentDueDate,
      fullPaymentDate: PaymentTable.fullPaymentDate,
      fullPaymentPaid: PaymentTable.fullPaymentPaid,
      createdAt: PaymentTable.createdAt,
    })
    .from(PaymentTable)
    .innerJoin(ClientTable, eq(PaymentTable.clientId, ClientTable.id))
    .where(and(...conditions))
    .orderBy(desc(PaymentTable.createdAt));

  // Get latest transaction for each payment to determine last payment date
  const paymentsWithTransactions = await Promise.all(
    payments.map(async (payment) => {
      const latestTransaction = await db
        .select({
          createdAt: max(ClientTransactionTable.createdAt),
        })
        .from(ClientTransactionTable)
        .where(
          and(
            eq(ClientTransactionTable.paymentId, payment.id),
            eq(ClientTransactionTable.transactionStatus, 'SUCCESS')
          )
        );

      // Calculate amount due based on payment type and status
      let amountDue = 0;
      let nextInstallmentDate: Date | null = null;
      let isOverdue = false;

      if (payment.paymentType === 'FULL_PAYMENT') {
        amountDue = payment.fullPaymentPaid ? 0 : payment.finalAmount;
        if (payment.fullPaymentDate && !payment.fullPaymentPaid) {
          nextInstallmentDate = new Date(payment.fullPaymentDate);
          isOverdue = new Date() > nextInstallmentDate;
        }
      } else if (payment.paymentType === 'INSTALLMENTS') {
        if (!payment.firstInstallmentPaid) {
          amountDue = payment.finalAmount;
          if (payment.firstInstallmentDate) {
            nextInstallmentDate = new Date(payment.firstInstallmentDate);
            isOverdue = new Date() > nextInstallmentDate;
          }
        } else if (!payment.secondInstallmentPaid) {
          amountDue = payment.finalAmount - (payment.originalAmount - payment.finalAmount); // Remaining after first installment
          if (payment.secondInstallmentDate) {
            nextInstallmentDate = new Date(payment.secondInstallmentDate);
            isOverdue = new Date() > nextInstallmentDate;
          }
        } else {
          amountDue = 0;
        }
      } else if (payment.paymentType === 'PAY_LATER') {
        amountDue = payment.finalAmount;
        if (payment.paymentDueDate) {
          nextInstallmentDate = new Date(payment.paymentDueDate);
          isOverdue = new Date() > nextInstallmentDate;
        }
      }

      // Determine payment status based on current state
      let displayStatus = payment.paymentStatus || 'PENDING';
      if (isOverdue && amountDue > 0) {
        displayStatus = 'OVERDUE';
      } else if (amountDue === 0) {
        displayStatus = 'FULLY_PAID';
      }

      return {
        id: payment.id,
        clientName: `${payment.clientFirstName} ${payment.clientMiddleName ? payment.clientMiddleName + ' ' : ''}${payment.clientLastName}`,
        amountDue,
        totalFees: payment.finalAmount,
        nextInstallmentDate,
        paymentStatus: displayStatus as 'PENDING' | 'PARTIALLY_PAID' | 'FULLY_PAID' | 'OVERDUE',
        lastPaymentDate: latestTransaction[0]?.createdAt
          ? new Date(latestTransaction[0].createdAt)
          : null,
        clientCode: `T${new Date(payment.createdAt).getFullYear()}-${payment.clientId.slice(-2)}`, // Generate client code
      };
    })
  );

  // Filter by payment status if provided
  if (paymentStatus && paymentStatus !== 'ALL') {
    return paymentsWithTransactions.filter((payment) => {
      if (paymentStatus === 'PENDING') {
        return payment.paymentStatus === 'PENDING';
      } else if (paymentStatus === 'PARTIALLY_PAID') {
        return payment.paymentStatus === 'PARTIALLY_PAID';
      } else if (paymentStatus === 'FULLY_PAID') {
        return payment.paymentStatus === 'FULLY_PAID';
      } else if (paymentStatus === 'OVERDUE') {
        return payment.paymentStatus === 'OVERDUE';
      }
      return true;
    });
  }

  return paymentsWithTransactions;
};

export const getPayments = async (name?: string, paymentStatus?: string) => {
  const { userId } = await auth();
  const branchId = await getCurrentOrganizationBranchId();

  if (!userId || !branchId) {
    return [];
  }

  return await _getPayments(branchId, name, paymentStatus);
};

export type Payment = Awaited<ReturnType<typeof getPayments>>[0];
