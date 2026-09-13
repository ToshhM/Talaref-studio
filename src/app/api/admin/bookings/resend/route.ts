import { NextResponse } from 'next/server';
import { getAdminEmail, getBrevoClient, getBrevoSender } from '@/lib/brevo';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type BookingType = 'studio' | 'congo';

type BookingData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  formatted_date?: string | null;
  booking_date?: string;
  event_date?: string;
  slot: string;
  service?: string;
  amount_paid_cents?: number;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const type = body.type as BookingType;
  const id = typeof body.id === 'string' ? body.id : '';

  if (!id || !['studio', 'congo'].includes(type)) {
    return NextResponse.json({ error: 'Réservation invalide.' }, { status: 400 });
  }

  const table = type === 'studio' ? 'studio_bookings' : 'event_bookings';
  const { data, error } = await supabaseAdmin
    .from(table)
    .select('*')
    .eq('id', id)
    .single();
  const booking = data as BookingData | null;

  if (error || !booking) {
    return NextResponse.json({ error: 'Réservation introuvable.' }, { status: 404 });
  }

  try {
    const brevo = getBrevoClient();
    const adminEmail = getAdminEmail();
    const firstName = escapeHtml(booking.first_name);
    const lastName = escapeHtml(booking.last_name);
    const email = escapeHtml(booking.email);
    const phone = escapeHtml(booking.phone || 'Non renseigné');
    const date = escapeHtml(
      booking.formatted_date || booking.booking_date || booking.event_date || 'Date non renseignée'
    );
    const slot = escapeHtml(booking.slot);
    const detail = escapeHtml(
      type === 'studio'
        ? `${booking.service || 'Réservation studio'} - ${(booking.amount_paid_cents || 0) / 100} EUR`
        : 'Shooting Day Congolais - Gratuit'
    );
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Confirmation de réservation - Talaref Studio</h2>
        <p>Bonjour ${firstName}, votre réservation est bien confirmée.</p>
        <p><strong>Prestation :</strong> ${detail}</p>
        <p><strong>Date :</strong> ${date} à ${slot}</p>
        <p><strong>Téléphone :</strong> ${phone}</p>
      </div>`;
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Renvoi d'une réservation</h2>
        <p><strong>Client :</strong> ${firstName} ${lastName}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Prestation :</strong> ${detail}</p>
        <p><strong>Date :</strong> ${date} à ${slot}</p>
        <p><strong>Téléphone :</strong> ${phone}</p>
      </div>`;

    const results = await Promise.allSettled([
      brevo.transactionalEmails.sendTransacEmail({
        sender: getBrevoSender(),
        to: [{ email: booking.email, name: `${booking.first_name} ${booking.last_name}` }],
        subject: 'Confirmation de votre réservation - Talaref Studio',
        htmlContent,
      }),
      brevo.transactionalEmails.sendTransacEmail({
        sender: getBrevoSender(),
        to: [{ email: adminEmail }],
        replyTo: { email: booking.email, name: `${booking.first_name} ${booking.last_name}` },
        subject: `Réservation - ${booking.first_name} ${booking.last_name}`,
        htmlContent: adminHtml,
      }),
    ]);

    const failed = results.filter((result) => result.status === 'rejected').length;
    if (failed > 0) {
      results.forEach((result) => {
        if (result.status === 'rejected') console.error('Booking resend email error:', result.reason);
      });
      return NextResponse.json(
        { error: failed === 2 ? 'Les deux emails ont échoué.' : 'Un des deux emails a échoué.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (resendError) {
    console.error('Booking resend configuration error:', resendError);
    return NextResponse.json({ error: 'Configuration Brevo incomplète.' }, { status: 500 });
  }
}