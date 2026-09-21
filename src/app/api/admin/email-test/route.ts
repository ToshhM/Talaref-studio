import { NextResponse } from 'next/server';
import { getAdminEmail, getMailjetSender, sendMailjetEmail } from '@/lib/mailjet';

export async function POST() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();

  if (!adminEmail) {
    return NextResponse.json(
      { error: 'ADMIN_EMAIL est absent dans les variables de production.' },
      { status: 500 }
    );
  }

  try {
    const configuredAdminEmail = getAdminEmail();

    await sendMailjetEmail({
      sender: getMailjetSender(),
      to: [{ email: configuredAdminEmail }],
      subject: 'Test email Mailjet - Talaref Studio',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Test Mailjet réussi</h2>
          <p>La configuration email de Talaref Studio fonctionne correctement.</p>
          <p>Ce message a été envoyé depuis la page administration, sans paiement.</p>
        </div>`,
    });

    return NextResponse.json({ success: true, recipient: configuredAdminEmail });
  } catch (error) {
    console.error('Mailjet test email error:', error);
    const mailjetError = error as { message?: string };

    return NextResponse.json(
      {
        error: [
          'Mailjet a refusé le mail de test.',
          mailjetError.message ? `Détail : ${mailjetError.message}` : '',
        ]
          .filter(Boolean)
          .join(' '),
      },
      { status: 502 }
    );
  }
}