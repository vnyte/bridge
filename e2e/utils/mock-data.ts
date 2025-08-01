export const mockClient = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@test.com',
  phoneNumber: '9876543210',
  dateOfBirth: '1995-01-15',
  address: '123 Test Street',
  city: 'Test City',
  state: 'Test State',
  postalCode: '123456',
  emergencyContact: 'Jane Doe',
  emergencyContactPhone: '9876543211',
};

export const mockLearningLicense = {
  llNumber: 'LL123456789',
  issueDate: '2024-01-01',
  expiryDate: '2024-06-01',
  rtoOffice: 'Test RTO',
  vehicleClasses: ['LMV', 'MCWG'],
};

export const mockDrivingLicense = {
  dlNumber: 'DL987654321',
  issueDate: '2024-06-01',
  expiryDate: '2044-06-01',
  rtoOffice: 'Test RTO',
  vehicleClasses: ['LMV'],
};

export const mockVehicle = {
  registrationNumber: 'MH01AB1234',
  make: 'Toyota',
  model: 'Corolla',
  year: '2022',
  vehicleType: 'LMV',
  fuelType: 'Petrol',
  transmissionType: 'Manual',
  insuranceNumber: 'INS123456',
  insuranceExpiry: '2025-12-31',
  pucNumber: 'PUC123456',
  pucExpiry: '2025-06-30',
  registrationExpiry: '2039-12-31',
};

export const mockPayment = {
  amount: 15000,
  paymentMethod: 'cash',
  installments: 2,
  firstInstallment: 8000,
  secondInstallment: 7000,
};
