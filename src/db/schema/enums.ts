import { pgEnum } from 'drizzle-orm/pg-core';

export const LicenseClassEnum = pgEnum('license_classes', [
  'LMV',
  'MCWG',
  'MCWOG',
  'MGV',
  'MPV',
  'HGV',
  'HPV',
]);

export const ServiceTypeEnum = pgEnum('service_type', ['FULL_SERVICE', 'DRIVING_ONLY']);
