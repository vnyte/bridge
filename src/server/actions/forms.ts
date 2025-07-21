'use server';

import { getClients, getClient } from '@/server/db/client';
import { db } from '@/db';
import { formPrints, ClientTable, LearningLicenseTable, DrivingLicenseTable } from '@/db/schema';
import { and, eq, isNull, sql, desc, or, inArray } from 'drizzle-orm';
import { getCurrentOrganizationBranchId } from '@/server/db/branch';
import { auth } from '@clerk/nextjs/server';

export const getClientsForForms = async () => {
  return getClients();
};

export const getClientForForm = async (clientId: string) => {
  return getClient(clientId);
};

type FilterType = 'new-only' | 'all-eligible' | 'recently-printed';

export const getEligibleStudentsForPermanentLicense = async (filter: FilterType = 'new-only') => {
  const branchId = await getCurrentOrganizationBranchId();
  if (!branchId) throw new Error('No branch found');

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const baseQuery = db
    .select({
      id: ClientTable.id,
      firstName: ClientTable.firstName,
      lastName: ClientTable.lastName,
      phoneNumber: ClientTable.phoneNumber,
      clientCode: ClientTable.clientCode,
      learningLicenseIssueDate: LearningLicenseTable.issueDate,
      learningLicenseClass: LearningLicenseTable.class,
      daysSinceLearningLicense: sql<number>`EXTRACT(DAY FROM AGE(CURRENT_DATE, ${LearningLicenseTable.issueDate}::date))`,
      printedAt: formPrints.printedAt,
      printedBy: formPrints.printedBy,
    })
    .from(ClientTable)
    .innerJoin(LearningLicenseTable, eq(ClientTable.id, LearningLicenseTable.clientId))
    .leftJoin(DrivingLicenseTable, eq(ClientTable.id, DrivingLicenseTable.clientId))
    .leftJoin(
      formPrints,
      and(eq(formPrints.clientId, ClientTable.id), eq(formPrints.formType, 'form-4'))
    );

  let query;

  // Helper function to check if driving license is actually issued (not just empty row)
  const noDrivingLicenseCondition = or(
    isNull(DrivingLicenseTable.id), // No row exists
    isNull(DrivingLicenseTable.licenseNumber), // Row exists but no license number
    isNull(DrivingLicenseTable.issueDate) // Row exists but no issue date
  );

  switch (filter) {
    case 'new-only':
      query = baseQuery.where(
        and(
          eq(ClientTable.branchId, branchId),
          noDrivingLicenseCondition,
          sql`${LearningLicenseTable.issueDate}::date <= ${thirtyDaysAgo.toISOString().split('T')[0]}`,
          isNull(formPrints.id) // Not printed yet
        )
      );
      break;
    case 'recently-printed':
      query = baseQuery.where(
        and(
          eq(ClientTable.branchId, branchId),
          noDrivingLicenseCondition,
          sql`${LearningLicenseTable.issueDate}::date <= ${thirtyDaysAgo.toISOString().split('T')[0]}`,
          sql`${formPrints.printedAt} >= ${sevenDaysAgo.toISOString()}`
        )
      );
      break;
    case 'all-eligible':
      query = baseQuery.where(
        and(
          eq(ClientTable.branchId, branchId),
          noDrivingLicenseCondition,
          sql`${LearningLicenseTable.issueDate}::date <= ${thirtyDaysAgo.toISOString().split('T')[0]}`
        )
      );
      break;
  }

  const results = await query.orderBy(desc(LearningLicenseTable.issueDate));

  return results.map((result) => ({
    ...result,
    isPrinted: !!result.printedAt,
    daysSincePrint: result.printedAt
      ? Math.floor((Date.now() - new Date(result.printedAt).getTime()) / (1000 * 60 * 60 * 24))
      : null,
  }));
};

export const markFormsAsPrinted = async (clientIds: string[], formType: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const branchId = await getCurrentOrganizationBranchId();
  if (!branchId) throw new Error('No branch found');

  const batchId = crypto.randomUUID();

  await db.insert(formPrints).values(
    clientIds.map((clientId) => ({
      clientId,
      formType,
      printedBy: userId,
      batchId,
      branchId,
    }))
  );

  return batchId;
};

export const getFormPrintStats = async () => {
  const branchId = await getCurrentOrganizationBranchId();
  if (!branchId) throw new Error('No branch found');

  const [totalEligible, newEligible, recentlyPrinted] = await Promise.all([
    getEligibleStudentsForPermanentLicense('all-eligible'),
    getEligibleStudentsForPermanentLicense('new-only'),
    getEligibleStudentsForPermanentLicense('recently-printed'),
  ]);

  return {
    totalEligible: totalEligible.length,
    newEligible: newEligible.length,
    recentlyPrinted: recentlyPrinted.length,
    alreadyPrinted: totalEligible.length - newEligible.length,
  };
};

export const getBulkClientDataForForms = async (clientIds: string[]) => {
  const branchId = await getCurrentOrganizationBranchId();
  if (!branchId) throw new Error('No branch found');

  const clients = await db
    .select({
      id: ClientTable.id,
      firstName: ClientTable.firstName,
      middleName: ClientTable.middleName,
      lastName: ClientTable.lastName,
      clientCode: ClientTable.clientCode,
      phoneNumber: ClientTable.phoneNumber,
      email: ClientTable.email,
      aadhaarNumber: ClientTable.aadhaarNumber,
      panNumber: ClientTable.panNumber,
      birthDate: ClientTable.birthDate,
      bloodGroup: ClientTable.bloodGroup,
      gender: ClientTable.gender,
      address: ClientTable.address,
      city: ClientTable.city,
      state: ClientTable.state,
      pincode: ClientTable.pincode,
      guardianFirstName: ClientTable.guardianFirstName,
      guardianMiddleName: ClientTable.guardianMiddleName,
      guardianLastName: ClientTable.guardianLastName,
      photoUrl: ClientTable.photoUrl,
      signatureUrl: ClientTable.signatureUrl,
      learningLicenseNumber: LearningLicenseTable.licenseNumber,
      learningLicenseIssueDate: LearningLicenseTable.issueDate,
      learningLicenseExpiryDate: LearningLicenseTable.expiryDate,
      learningLicenseClass: LearningLicenseTable.class,
    })
    .from(ClientTable)
    .innerJoin(LearningLicenseTable, eq(ClientTable.id, LearningLicenseTable.clientId))
    .where(and(eq(ClientTable.branchId, branchId), inArray(ClientTable.id, clientIds)));

  return clients;
};
