import { format } from 'date-fns';

export function generateOnboardingMessage(student: {
  name: string;
  schedule: { date: Date; time: string }[];
  totalSessions: number;
}) {
  const scheduleDetails = student.schedule
    .map((s, i) => `Session ${i + 1}: ${format(s.date, 'EEEE, MMM d')} at ${s.time}`)
    .join('\n');

  return `Hello ${student.name},\n\nWelcome to our Driving School! 🚗\n\nYour lesson schedule:\n${scheduleDetails}\n\nTotal sessions: ${student.totalSessions}\n\nIf you have questions, reply to this message. Good luck!`;
}

export function generatePaymentMessage(student: {
  name: string;
  amount: number;
  date: Date;
  type: 'full' | 'partial' | 'installment';
}) {
  return `Hi ${student.name},\n\nWe have received your ${student.type} payment of ₹${student.amount} on ${format(
    student.date,
    'PPP'
  )}.\n\nThank you! If you have questions, reply to this message.`;
}

export function generatePaymentReceipt(student: {
  name: string;
  amount: number;
  date: Date;
  type: 'full' | 'partial' | 'installment';
  paymentMode: string;
  transactionReference?: string;
  totalAmount?: number;
  remainingAmount?: number;
  installmentNumber?: number;
}) {
  const receiptNumber = student.transactionReference || `REC-${Date.now()}`;
  const dateFormatted = format(student.date, 'PPP');
  const timeFormatted = format(student.date, 'p');

  let receiptType = '';
  let amountDetails = '';

  switch (student.type) {
    case 'full':
      receiptType = 'Full Payment Receipt';
      amountDetails = `Total Amount: ₹${student.amount}`;
      break;
    case 'partial':
      receiptType = 'Partial Payment Receipt';
      amountDetails = `Amount Paid: ₹${student.amount}`;
      if (student.totalAmount && student.remainingAmount) {
        amountDetails += `\nTotal Amount: ₹${student.totalAmount}\nRemaining Amount: ₹${student.remainingAmount}`;
      }
      break;
    case 'installment':
      receiptType = `Installment Payment Receipt (${student.installmentNumber || 1}/${student.totalAmount ? Math.ceil(student.totalAmount / student.amount) : '?'})`;
      amountDetails = `Installment Amount: ₹${student.amount}`;
      if (student.totalAmount && student.remainingAmount) {
        amountDetails += `\nTotal Amount: ₹${student.totalAmount}\nRemaining Amount: ₹${student.remainingAmount}`;
      }
      break;
  }

  return `🏛️ DRIVING SCHOOL PAYMENT RECEIPT 🏛️

${receiptType}
Receipt No: ${receiptNumber}
Date: ${dateFormatted}
Time: ${timeFormatted}
Payment Mode: ${student.paymentMode.toUpperCase()}

Student: ${student.name}

${amountDetails}

Status: ✅ Payment Confirmed

Thank you for choosing our driving school!
For any queries, reply to this message.`;
}

export function generateComprehensiveOnboardingMessage(student: {
  name: string;
  schedule: { date: Date; time: string }[];
  totalSessions: number;
  vehicleDetails: {
    name: string;
    number: string;
    type?: string;
  };
  paymentAmount: number;
  paymentMode: string;
  transactionReference?: string;
  totalAmount?: number;
  remainingAmount?: number;
}) {
  const scheduleDetails = student.schedule
    .map((s, i) => `📅 Session ${i + 1}: ${format(s.date, 'EEEE, MMM d')} at ${s.time}`)
    .join('\n');

  const receiptNumber = student.transactionReference || `REC-${Date.now()}`;
  const currentDate = new Date();
  const dateFormatted = format(currentDate, 'PPP');
  const timeFormatted = format(currentDate, 'p');

  return `🎉 WELCOME TO OUR DRIVING SCHOOL! 🎉

Dear ${student.name},

We're excited to have you join our driving school family! 🚗✨

📋 ENROLLMENT DETAILS:
• Total Sessions: ${student.totalSessions}
• Vehicle: ${student.vehicleDetails.name} (${student.vehicleDetails.number})
${student.vehicleDetails.type ? `• Vehicle Type: ${student.vehicleDetails.type}` : ''}

📅 YOUR SESSION SCHEDULE:
${scheduleDetails}

💰 PAYMENT INFORMATION:
• Amount Paid: ₹${student.paymentAmount}
• Payment Mode: ${student.paymentMode.toUpperCase()}
• Receipt No: ${receiptNumber}
• Payment Date: ${dateFormatted}
• Payment Time: ${timeFormatted}
${student.totalAmount && student.remainingAmount ? `• Total Course Fee: ₹${student.totalAmount}\n• Remaining Amount: ₹${student.remainingAmount}` : ''}

✅ STATUS: Payment Confirmed & Enrollment Complete

📱 IMPORTANT REMINDERS:
• Please arrive 10 minutes before your scheduled session
• Bring your learning license (if applicable)
• Wear comfortable footwear
• Sessions are ${student.totalSessions > 1 ? 'conducted weekly' : 'conducted as scheduled'}

❓ Need to reschedule or have questions?
Reply to this message or call us directly.

Good luck with your driving journey! 🚗💨
We're here to help you become a confident driver!`;
}

export function generateCombinedOnboardingAndReceipt(student: {
  name: string;
  schedule: { date: Date; time: string }[];
  totalSessions: number;
  paymentAmount: number;
  paymentMode: string;
  transactionReference?: string;
}) {
  const onboardingMessage = generateOnboardingMessage({
    name: student.name,
    schedule: student.schedule,
    totalSessions: student.totalSessions,
  });

  const receiptMessage = generatePaymentReceipt({
    name: student.name,
    amount: student.paymentAmount,
    date: new Date(),
    type: 'full',
    paymentMode: student.paymentMode,
    transactionReference: student.transactionReference,
  });

  return `${onboardingMessage}\n\n${'─'.repeat(40)}\n\n${receiptMessage}`;
}
