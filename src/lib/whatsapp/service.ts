import { sendWhatsAppMessage } from './cloud';
import {
  generateOnboardingMessage,
  generatePaymentMessage,
  generatePaymentReceipt,
  generateComprehensiveOnboardingMessage,
} from './messages';
import { isValidPhone } from './validate-phone';
import { retry } from './retry';
import { db } from '@/db';
import { MessageLogsTable } from '@/db/schema/message-logs/columns';
import { nanoid } from 'nanoid';

export async function sendOnboardingWhatsApp(client: {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  plan?: {
    numberOfSessions: number;
    joiningDate: string;
    joiningTime: string;
  };
  sessions?: Array<{
    sessionDate: string;
    startTime: string;
  }>;
}) {
  if (!isValidPhone(client.phoneNumber)) {
    await logMessageAttempt({
      clientId: client.id,
      messageType: 'onboarding',
      status: 'failure',
      error: 'Invalid phone number',
      retryCount: 0,
    });
    return { success: false, error: 'Invalid phone number' };
  }

  // Check if onboarding message already sent (you can add a flag to client table later)
  // For now, we'll check if there's already a successful onboarding message log
  const existingLog = await db.query.MessageLogsTable.findFirst({
    where: (logs, { eq, and }) =>
      and(
        eq(logs.clientId, client.id),
        eq(logs.messageType, 'onboarding'),
        eq(logs.status, 'success')
      ),
  });

  if (existingLog) {
    return { success: false, error: 'Onboarding message already sent' };
  }

  // Generate schedule from plan or use provided sessions
  let schedule: Array<{ date: Date; time: string }> = [];
  let totalSessions = 0;

  if (client.sessions && client.sessions.length > 0) {
    schedule = client.sessions.map((session) => ({
      date: new Date(session.sessionDate),
      time: session.startTime.substring(0, 5), // Remove seconds
    }));
    totalSessions = client.sessions.length;
  } else if (client.plan) {
    // Generate schedule from plan (simplified - you might want to use your existing session generation logic)
    const joiningDate = new Date(client.plan.joiningDate);
    const joiningTime = client.plan.joiningTime.substring(0, 5);

    for (let i = 0; i < client.plan.numberOfSessions; i++) {
      const sessionDate = new Date(joiningDate);
      sessionDate.setDate(joiningDate.getDate() + i * 7); // Weekly sessions

      schedule.push({
        date: sessionDate,
        time: joiningTime,
      });
    }
    totalSessions = client.plan.numberOfSessions;
  }

  const message = generateOnboardingMessage({
    name: `${client.firstName} ${client.lastName}`,
    schedule,
    totalSessions,
  });

  let result;
  try {
    result = await retry(() => sendWhatsAppMessage(client.phoneNumber, message), 3, 2000);

    await logMessageAttempt({
      clientId: client.id,
      messageType: 'onboarding',
      status: result.success ? 'success' : 'failure',
      error: result.success ? null : JSON.stringify(result.error),
      retryCount: 0,
    });

    return result;
  } catch (error) {
    await logMessageAttempt({
      clientId: client.id,
      messageType: 'onboarding',
      status: 'failure',
      error: JSON.stringify(error),
      retryCount: 3,
    });
    return { success: false, error };
  }
}

export async function sendPaymentWhatsApp(
  client: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  },
  payment: {
    amount: number;
    date: Date;
    type: 'full' | 'partial' | 'installment';
  }
) {
  if (!isValidPhone(client.phoneNumber)) {
    await logMessageAttempt({
      clientId: client.id,
      messageType: 'payment',
      status: 'failure',
      error: 'Invalid phone number',
      retryCount: 0,
    });
    return { success: false, error: 'Invalid phone number' };
  }

  const message = generatePaymentMessage({
    name: `${client.firstName} ${client.lastName}`,
    amount: payment.amount,
    date: payment.date,
    type: payment.type,
  });

  let result;
  try {
    result = await retry(() => sendWhatsAppMessage(client.phoneNumber, message), 3, 2000);

    await logMessageAttempt({
      clientId: client.id,
      messageType: 'payment',
      status: result.success ? 'success' : 'failure',
      error: result.success ? null : JSON.stringify(result.error),
      retryCount: 0,
    });

    return result;
  } catch (error) {
    await logMessageAttempt({
      clientId: client.id,
      messageType: 'payment',
      status: 'failure',
      error: JSON.stringify(error),
      retryCount: 3,
    });
    return { success: false, error };
  }
}

export async function sendPaymentReceiptWhatsApp(
  client: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  },
  payment: {
    amount: number;
    date: Date;
    type: 'full' | 'partial' | 'installment';
    paymentMode: string;
    transactionReference?: string;
    totalAmount?: number;
    remainingAmount?: number;
    installmentNumber?: number;
  }
) {
  if (!isValidPhone(client.phoneNumber)) {
    await logMessageAttempt({
      clientId: client.id,
      messageType: 'payment_receipt',
      status: 'failure',
      error: 'Invalid phone number',
      retryCount: 0,
    });
    return { success: false, error: 'Invalid phone number' };
  }

  const message = generatePaymentReceipt({
    name: `${client.firstName} ${client.lastName}`,
    amount: payment.amount,
    date: payment.date,
    type: payment.type,
    paymentMode: payment.paymentMode,
    transactionReference: payment.transactionReference,
    totalAmount: payment.totalAmount,
    remainingAmount: payment.remainingAmount,
    installmentNumber: payment.installmentNumber,
  });

  let result;
  try {
    result = await retry(() => sendWhatsAppMessage(client.phoneNumber, message), 3, 2000);

    await logMessageAttempt({
      clientId: client.id,
      messageType: 'payment_receipt',
      status: result.success ? 'success' : 'failure',
      error: result.success ? null : JSON.stringify(result.error),
      retryCount: 0,
    });

    return result;
  } catch (error) {
    await logMessageAttempt({
      clientId: client.id,
      messageType: 'payment_receipt',
      status: 'failure',
      error: JSON.stringify(error),
      retryCount: 3,
    });
    return { success: false, error };
  }
}

export async function sendOnboardingWithReceiptWhatsApp(client: {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  plan: {
    numberOfSessions: number;
    joiningDate: string;
    joiningTime: string;
  };
  sessions: Array<{
    sessionDate: string;
    startTime: string;
  }>;
  payment: {
    amount: number;
    paymentMode: string;
    transactionReference?: string;
  };
  vehicleDetails: {
    name: string;
    number: string;
    type?: string;
  };
}) {
  if (!isValidPhone(client.phoneNumber)) {
    await logMessageAttempt({
      clientId: client.id,
      messageType: 'onboarding_with_receipt',
      status: 'failure',
      error: 'Invalid phone number',
      retryCount: 0,
    });
    return { success: false, error: 'Invalid phone number' };
  }

  // Check if onboarding message already sent
  const existingLog = await db.query.MessageLogsTable.findFirst({
    where: (logs, { eq, and }) =>
      and(
        eq(logs.clientId, client.id),
        eq(logs.messageType, 'onboarding_with_receipt'),
        eq(logs.status, 'success')
      ),
  });

  if (existingLog) {
    return { success: false, error: 'Onboarding with receipt message already sent' };
  }

  // Generate schedule from plan or use provided sessions
  let schedule: Array<{ date: Date; time: string }> = [];
  let totalSessions = 0;

  if (client.sessions && client.sessions.length > 0) {
    schedule = client.sessions.map((session) => ({
      date: new Date(session.sessionDate),
      time: session.startTime.substring(0, 5), // Remove seconds
    }));
    totalSessions = client.sessions.length;
  } else if (client.plan) {
    // Generate schedule from plan
    const joiningDate = new Date(client.plan.joiningDate);
    const joiningTime = client.plan.joiningTime.substring(0, 5);

    for (let i = 0; i < client.plan.numberOfSessions; i++) {
      const sessionDate = new Date(joiningDate);
      sessionDate.setDate(joiningDate.getDate() + i * 7); // Weekly sessions

      schedule.push({
        date: sessionDate,
        time: joiningTime,
      });
    }
    totalSessions = client.plan.numberOfSessions;
  }

  const message = generateComprehensiveOnboardingMessage({
    name: `${client.firstName} ${client.lastName}`,
    schedule,
    totalSessions,
    vehicleDetails: client.vehicleDetails,
    paymentAmount: client.payment.amount,
    paymentMode: client.payment.paymentMode,
    transactionReference: client.payment.transactionReference,
    totalAmount: client.payment.amount, // Assuming full payment for now
    remainingAmount: 0,
  });

  let result;
  try {
    result = await retry(() => sendWhatsAppMessage(client.phoneNumber, message), 3, 2000);

    await logMessageAttempt({
      clientId: client.id,
      messageType: 'onboarding_with_receipt',
      status: result.success ? 'success' : 'failure',
      error: result.success ? null : JSON.stringify(result.error),
      retryCount: 0,
    });

    return result;
  } catch (error) {
    await logMessageAttempt({
      clientId: client.id,
      messageType: 'onboarding_with_receipt',
      status: 'failure',
      error: JSON.stringify(error),
      retryCount: 3,
    });
    return { success: false, error };
  }
}

async function logMessageAttempt(log: {
  clientId: string;
  messageType: string;
  status: string;
  error: string | null;
  retryCount: number;
}) {
  try {
    await db.insert(MessageLogsTable).values({
      id: nanoid(),
      clientId: log.clientId,
      messageType: log.messageType,
      status: log.status,
      error: log.error,
      retryCount: log.retryCount,
    });
  } catch (error) {
    console.error('Failed to log message attempt:', error);
  }
}
