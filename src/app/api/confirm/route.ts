import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { google } from 'googleapis';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

const resend = new Resend(process.env.RESEND_API_KEY);

// --- CONFIGURATION GOOGLE CALENDAR ---
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: SCOPES,
});
const calendar = google.calendar({ version: 'v3', auth });

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID manquant' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'payment_intent.latest_charge'],
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Paiement non validé' }, { status: 400 });
    }

    // NOUVEAU : On récupère "phone", "siret" et "companyName" depuis Stripe
    const {
      firstName, lastName, email, phone, siret, companyName,
      date, formattedDate, slot, duration, paymentMode, service, message
    } = session.metadata || {};

    const bgColor = '#f9fafb';
    const cardColor = '#ffffff';
    const textColor = '#333333';
    const lightTextColor = '#6b7280';
    const borderColor = '#e5e7eb';
    const buttonColor = '#000000';

    const amountPaid = session.amount_total! / 100;

    const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;
    const latestCharge = paymentIntent?.latest_charge as Stripe.Charge | null;
    const finalReceiptUrl = latestCharge?.receipt_url || 'https://dashboard.stripe.com/test/payments';

    // --- GESTION DU RESTE À PAYER ET DES LABELS ---
    let paymentStatusAdmin = "Plein tarif (100%)";
    let paymentStatusClientHtml = "";
    let remainingAmountStr = "0,00 €";

    let remainingAmountAdminHtml = `
      <p style="margin: 15px 0 5px 0; font-size: 14px; color: ${lightTextColor};">Reste à régler sur place</p>
      <p style="margin: 0 0 15px 0; font-weight: bold;">0,00 €</p>
    `;

    if (paymentMode === "deposit") {
      paymentStatusAdmin = "Acompte (30%)";
      const remainingAmount = (amountPaid / 0.3) * 0.7;
      remainingAmountStr = `${remainingAmount.toFixed(2).replace('.', ',')} €`;

      paymentStatusClientHtml = `
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid ${borderColor};">
          <p style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; color: ${lightTextColor}; font-weight: bold; letter-spacing: 0.5px;">Solde restant à régler sur place</p>
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: ${textColor};">${remainingAmountStr}</p>
        </div>
      `;

      remainingAmountAdminHtml = `
        <p style="margin: 15px 0 5px 0; font-size: 14px; color: ${lightTextColor};">Reste à régler sur place</p>
        <p style="margin: 0 0 15px 0; font-weight: bold;">${remainingAmountStr}</p>
      `;
    }

    // --- SYNCHRONISATION GOOGLE CALENDAR ---
    try {
      // "date" est maintenant du style "2026-05-21" envoyé par le front
      const startDateTimeStr = `${date}T${slot}:00`;
      const startDateObj = new Date(startDateTimeStr);

      const parsedDuration = Number(duration) || 1;
      const endDateObj = new Date(startDateObj.getTime() + parsedDuration * 60 * 60 * 1000);

      // On calcule l'heure de fin localement pour éviter le .toISOString() qui met le foutoir avec le "Z"
      const endDateTimeStr = `${endDateObj.getFullYear()}-${String(endDateObj.getMonth()+1).padStart(2,'0')}-${String(endDateObj.getDate()).padStart(2,'0')}T${String(endDateObj.getHours()).padStart(2,'0')}:${String(endDateObj.getMinutes()).padStart(2,'0')}:00`;

      await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        sendUpdates: 'all',
        requestBody: {
          summary: `📸 ${service} - ${firstName} ${lastName}`,
          location: '5 Rue Bellanger, 92300 Levallois-Perret',
          // NOUVEAU : Ajout de phone, companyName et siret dans la description Calendar
          description: `Prestation : ${service}\nClient : ${firstName} ${lastName}\nEmail : ${email}\nTéléphone : ${phone || 'Non renseigné'}${siret ? `\nEntreprise : ${companyName} (SIRET : ${siret})` : ''}\n\nType de paiement : ${paymentStatusAdmin}\nMontant payé : ${amountPaid.toFixed(2)} €\nReste à régler : ${remainingAmountStr}\n\nMessage client : ${message || 'Aucun'}`,
          start: {
            dateTime: startDateTimeStr,
            timeZone: 'Europe/Paris',
          },
          end: {
            dateTime: endDateTimeStr,
            timeZone: 'Europe/Paris',
          },
          attendees: [{ email: email }],
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 60 },
            ],
          },
        },
      });
      console.log("Événement Google Calendar créé avec succès !");
    } catch (calendarError) {
      console.error("Erreur lors de la création de l'événement Google Calendar :", calendarError);
    }

    // 1. Mail pour TOI (Talaref Studio) - Version Admin
    await resend.emails.send({
      from: 'Talaref Studio <onboarding@resend.dev>',
      to: ['talaref.fr@gmail.com'],
      subject: `Nouvelle réservation : ${service} - ${firstName} ${lastName}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${bgColor}; color: ${textColor}; padding: 40px; text-align: center;">
          <div style="background-color: ${cardColor}; border: 1px solid ${borderColor}; padding: 30px; border-radius: 8px; text-align: left; max-width: 500px; margin: 0 auto;">
            <h2 style="margin-top: 0; font-size: 20px; color: ${textColor}; border-bottom: 1px solid ${borderColor}; padding-bottom: 15px;">Détails de la réservation</h2>

            <p style="margin: 15px 0 5px 0; font-size: 14px; color: ${lightTextColor};">Prestation</p>
            <p style="margin: 0 0 15px 0; font-weight: bold;">${service}</p>

            <p style="margin: 15px 0 5px 0; font-size: 14px; color: ${lightTextColor};">Client</p>
            <p style="margin: 0 0 15px 0; font-weight: bold;">${firstName} ${lastName} (<a href="mailto:${email}" style="color: ${textColor};">${email}</a>)<br>📞 ${phone || 'Non renseigné'}${siret ? `<br>🏢 ${companyName} (SIRET : ${siret})` : ''}</p>

            <p style="margin: 15px 0 5px 0; font-size: 14px; color: ${lightTextColor};">Date & Durée</p>
            <p style="margin: 0 0 15px 0; font-weight: bold;">${formattedDate || date} à ${slot} (${duration}h)</p>

            <div style="border-top: 1px solid ${borderColor}; margin: 20px 0;"></div>

            <p style="margin: 15px 0 5px 0; font-size: 14px; color: ${lightTextColor};">Type de paiement</p>
            <p style="margin: 0 0 15px 0; font-weight: bold;">${paymentStatusAdmin}</p>

            <p style="margin: 15px 0 5px 0; font-size: 14px; color: ${lightTextColor};">Montant encaissé</p>
            <p style="margin: 0 0 15px 0; font-weight: bold;">${amountPaid.toFixed(2).replace('.', ',')} €</p>

            ${remainingAmountAdminHtml}

            <div style="border-top: 1px solid ${borderColor}; margin: 20px 0;"></div>

            <p style="margin: 15px 0 5px 0; font-size: 14px; color: ${lightTextColor};">Message du client</p>
            <p style="margin: 0; font-style: italic;">${message || 'Aucune information complémentaire'}</p>
          </div>
          <p style="margin-top: 20px; font-size: 13px; color: ${lightTextColor};">
            Consulter cette transaction sur le <a href="https://dashboard.stripe.com/test/payments" style="color: ${textColor}; text-decoration: underline;">Dashboard Stripe</a>.
          </p>
        </div>
      `,
    });

    // 2. Mail pour le CLIENT - Version Corporate
    await resend.emails.send({
      from: 'Talaref Studio <onboarding@resend.dev>',
      to: [email!],
      subject: `Confirmation de votre réservation - Talaref Studio`,
      html: `
        <div style="background-color: ${bgColor}; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px 20px; color: ${textColor}; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: ${cardColor}; border: 1px solid ${borderColor}; border-radius: 8px; overflow: hidden;">

            <div style="padding: 40px; text-align: center; border-bottom: 1px solid ${borderColor};">
              <h1 style="font-size: 22px; font-weight: bold; margin: 0; color: ${textColor}; text-transform: uppercase; letter-spacing: 1px;">Confirmation de réservation</h1>
            </div>

            <div style="padding: 40px;">
              <p style="font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 30px; color: ${textColor};">
                Bonjour ${firstName},<br><br>
                Nous vous confirmons la bonne réception de votre paiement. Votre réservation est désormais validée. Veuillez trouver ci-dessous le récapitulatif de votre séance :
              </p>

              <div style="background-color: ${bgColor}; padding: 25px; border-radius: 6px; border: 1px solid ${borderColor}; margin-bottom: 30px;">
                <p style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; color: ${lightTextColor}; font-weight: bold; letter-spacing: 0.5px;">Prestation</p>
                <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: bold;">${service}</p>

                <p style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; color: ${lightTextColor}; font-weight: bold; letter-spacing: 0.5px;">Date et Heure</p>
                <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: bold;">${formattedDate || date} à ${slot} (${duration}h)</p>

                ${siret ? `
                <p style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; color: ${lightTextColor}; font-weight: bold; letter-spacing: 0.5px;">Facturation Entreprise</p>
                <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: bold;">${companyName}<br><span style="font-size: 14px; font-weight: normal; color: ${lightTextColor};">SIRET : ${siret}</span></p>
                ` : ''}

                <p style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; color: ${lightTextColor}; font-weight: bold; letter-spacing: 0.5px;">Montant payé</p>
                <p style="margin: 0; font-size: 16px; font-weight: bold;">${amountPaid.toFixed(2).replace('.', ',')} €</p>

                ${paymentStatusClientHtml}
              </div>

              <div style="margin-bottom: 30px;">
                <p style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; color: ${lightTextColor}; font-weight: bold; letter-spacing: 0.5px;">Lieu du rendez-vous</p>
                <p style="margin: 0; font-size: 15px;">5 Rue Bellanger, 92300 Levallois-Perret</p>
              </div>

              <div style="text-align: center; margin-top: 40px;">
                <a href="${finalReceiptUrl}"
                   style="display: inline-block; background-color: ${buttonColor}; color: #ffffff; padding: 16px 32px; border-radius: 6px; font-weight: bold; text-decoration: none; font-size: 14px;">
                  Télécharger la facture
                </a>
              </div>
            </div>

            <div style="background-color: ${bgColor}; padding: 30px; text-align: center; border-top: 1px solid ${borderColor};">
              <p style="font-size: 13px; color: ${lightTextColor}; margin: 0; line-height: 1.5;">
                Pour toute question ou demande de modification, nous vous invitons à répondre directement à cet e-mail.<br><br>
                Nous avons également ajouté cet événement à votre calendrier.<br><br>
                <strong>L'équipe Talaref Studio</strong>
              </p>
            </div>

          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erreur Confirmation:", error);
    return NextResponse.json({ error: 'Erreur lors de la confirmation' }, { status: 500 });
  }
}