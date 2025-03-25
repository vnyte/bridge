import { pgEnum } from 'drizzle-orm/pg-core';

export const LicenseTypeEnum = pgEnum('license_types', [
  'LMV',
  'MCWG',
  'MCWOG',
  'MGV',
  'MPV',
  'HGV',
  'HPV',
]);
