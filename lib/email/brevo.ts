import type { Appointment } from '@/lib/types/database';

export async function sendAppointmentEmail(appointment: Appointment & { service_name: string; barber_name?: string }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn('[brevo] BREVO_API_KEY not configured, skipping email');
    return { skipped: true };
  }

  const html = appointmentEmailHtml(appointment);
  const body = {
    sender: { email: process.env.BREVO_SENDER_EMAIL!, name: process.env.BREVO_SENDER_NAME! },
    to: [{ email: appointment.guest_email, name: appointment.guest_full_name }],
    subject: `Cita confirmada · ${appointment.appointment_code}`,
    htmlContent: html,
  };

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) return { ok: false, status: res.status, error: await res.text() };
  return { ok: true };
}

function appointmentEmailHtml(apt: Appointment & { service_name: string; barber_name?: string }) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0c0f;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0c0f;padding:40px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#0f1215;border:1px solid rgba(201,169,110,0.2);border-radius:8px;overflow:hidden;">
      <tr><td style="background:linear-gradient(135deg,#0a0c0f,#1a1208);padding:40px;text-align:center;">
        <h1 style="margin:0;color:#c9a96e;font-size:32px;letter-spacing:8px;font-weight:400;text-transform:uppercase;">BarberBros</h1>
        <p style="margin:8px 0 0;color:rgba(240,237,232,0.5);font-size:11px;letter-spacing:3px;text-transform:uppercase;">Arte en cada Detalle</p>
      </td></tr>
      <tr><td style="padding:48px 40px 32px;text-align:center;">
        <p style="color:rgba(240,237,232,0.6);font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px;">Código de Cita</p>
        <p style="color:#c9a96e;font-size:36px;font-weight:700;margin:0;letter-spacing:4px;">${apt.appointment_code}</p>
      </td></tr>
      <tr><td style="padding:0 40px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:16px 0;border-top:1px solid rgba(201,169,110,0.15);color:rgba(240,237,232,0.5);font-size:11px;letter-spacing:2px;text-transform:uppercase;width:50%;">Servicio</td>
            <td style="padding:16px 0;border-top:1px solid rgba(201,169,110,0.15);color:#f0ede8;font-size:14px;text-align:right;">${apt.service_name}</td>
          </tr>
          <tr>
            <td style="padding:16px 0;border-top:1px solid rgba(201,169,110,0.1);color:rgba(240,237,232,0.5);font-size:11px;letter-spacing:2px;text-transform:uppercase;">Fecha</td>
            <td style="padding:16px 0;border-top:1px solid rgba(201,169,110,0.1);color:#f0ede8;font-size:14px;text-align:right;">${apt.appointment_date}</td>
          </tr>
          <tr>
            <td style="padding:16px 0;border-top:1px solid rgba(201,169,110,0.1);color:rgba(240,237,232,0.5);font-size:11px;letter-spacing:2px;text-transform:uppercase;">Hora</td>
            <td style="padding:16px 0;border-top:1px solid rgba(201,169,110,0.1);color:#f0ede8;font-size:14px;text-align:right;">${apt.appointment_time}</td>
          </tr>
          ${apt.barber_name ? `<tr>
            <td style="padding:16px 0;border-top:1px solid rgba(201,169,110,0.1);color:rgba(240,237,232,0.5);font-size:11px;letter-spacing:2px;text-transform:uppercase;">Barbero</td>
            <td style="padding:16px 0;border-top:1px solid rgba(201,169,110,0.1);color:#f0ede8;font-size:14px;text-align:right;">${apt.barber_name}</td>
          </tr>` : ''}
          <tr>
            <td style="padding:16px 0;border-top:1px solid rgba(201,169,110,0.15);color:#c9a96e;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Total</td>
            <td style="padding:16px 0;border-top:1px solid rgba(201,169,110,0.15);color:#c9a96e;font-size:20px;font-weight:700;text-align:right;">S/ ${apt.price.toFixed(2)}</td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 40px 40px;text-align:center;">
        <p style="color:rgba(240,237,232,0.4);font-size:12px;margin:0;">Por favor llega 5 minutos antes. Av. Principal 123 · Lima, Perú</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}
