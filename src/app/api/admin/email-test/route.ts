import { NextResponse } from 'next/server';
import { getAdminEmail, getBrevoClient, getBrevoSender } from '@/lib/brevo';

export async function POST() {
  try {
    const brevo = getBrevoClient();
    const adminEmail = getAdminEmail();

    await brevo.transactionalEmails.sendTransacEmail({
      sender: getBrevoSender(),
      to: [{ email: adminEmail }],
      subject: 'Test email Brevo - Talaref Studio',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Test Brevo réussi</h2>
          <p>La configuration email de Talaref Studio fonctionne correctement.</p>
          <p>Ce message a été envoyé depuis la page administration, sans paiement.</p>
        </div>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Brevo test email error:', error);
    return NextResponse.json(
      { error: 'Le mail de test n’a pas pu être envoyé. Vérifie les variables Brevo et l’expéditeur.' },
      { status: 502 }
    );
  }
}