export function isValidPhone(phone: string) {
  // WhatsApp expects E.164 format, e.g., "919876543210"
  return /^\d{10,15}$/.test(phone);
}
