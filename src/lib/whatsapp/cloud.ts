export async function sendWhatsAppMessage(to: string, body: string) {
  const token = process.env.WHATSAPP_CLOUD_TOKEN!;
  const phoneNumberId = process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID!;
  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('WhatsApp API error:', data);
    return { success: false, error: data };
  }
  return { success: true, data };
}
