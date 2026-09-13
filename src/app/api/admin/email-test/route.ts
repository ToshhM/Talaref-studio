import { NextResponse } from 'next/server';
import { getAdminEmail, getBrevoClient, getBrevoSender } from '@/lib/brevo';

export async function POST() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();

  if (!adminEmail) {
    return NextResponse.json(
      { error: 'ADMIN_EMAIL est absent dans les variables de production.' },
      { status: 500 }
    );
  }

  try {
    const brevo = getBrevoClient();
    const configuredAdminEmail = getAdminEmail();

    await brevo.transactionalEmails.sendTransacEmail({
      sender: getBrevoSender(),
      to: [{ email: configuredAdminEmail }],
      subject: 'Test email Brevo - Talaref Studio',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Test Brevo réussi</h2>
          <p>La configuration email de Talaref Studio fonctionne correctement.</p>
          <p>Ce message a été envoyé depuis la page administration, sans paiement.</p>
        </div>`,
    });

    return NextResponse.json({ success: true, recipient: configuredAdminEmail });
  } catch (error) {
    console.error('Brevo test email error:', error);
    const brevoError = error as {
      code?: string;
      message?: string;
      body?: { code?: string; message?: string };
      response?: { body?: { code?: string; message?: string } };
    };
    const code = brevoError.body?.code || brevoError.response?.body?.code || brevoError.code;
    const message =
      brevoError.body?.message ||
      brevoError.response?.body?.message ||
      brevoError.message;

    return NextResponse.json(
      {
        error: [
          'Brevo a refusé le mail de test.',
          code ? `Code : ${code}.` : '',
          message ? `Détail : ${message}` : '',
        ]
          .filter(Boolean)
          .join(' '),
      },
      { status: 502 }
    );
  }
}