import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { BrevoClient } from '@getbrevo/brevo';
import { google } from 'googleapis';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

// --- CONFIGURATION BREVO ---
const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
});

// --- CONFIGURATION GOOGLE CALENDAR ---
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const TIME_ZONE = 'Europe/Paris';
const STUDIO_ADDRESS = '5 Rue Bellanger, 92300 Levallois-Perret';

function pad2(value: number) {
  return String(value).padStart(2, '0');
}

function getGooglePrivateKey() {
  let key = '';

  if (process.env.GOOGLE_PRIVATE_KEY_BASE64) {
    key = Buffer.from(
      process.env.GOOGLE_PRIVATE_KEY_BASE64.trim(),
      'base64'
    ).toString('utf8');
  } else if (process.env.GOOGLE_PRIVATE_KEY) {
    key = process.env.GOOGLE_PRIVATE_KEY;
  }

  key = key.trim();

  // Sécurité si la clé a été encodée avec les guillemets du JSON.
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }

  // Sécurité si une virgule JSON a été copiée à la fin.
  if (key.endsWith(',')) {
    key = key.slice(0, -1).trim();
  }

  // Transforme les \n écrits en texte en vrais retours à la ligne.
  key = key.replace(/\\n/g, '\n').trim();

  return key;
}

function createGoogleCalendarClient() {
  const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const googlePrivateKey = getGooglePrivateKey();

  const auth = new google.auth.JWT({
    email: serviceEmail,
    key: googlePrivateKey,
    scopes: SCOPES,
  });

  return google.calendar({ version: 'v3', auth });
}

function getParisOffset(date: string) {
  const probeDate = new Date(`${date}T12:00:00Z`);

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    timeZoneName: 'shortOffset',
  }).formatToParts(probeDate);

  const timeZoneName =
    parts.find((part) => part.type === 'timeZoneName')?.value || 'GMT+1';

  const match = timeZoneName.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);

  if (!match) {
    return '+01:00';
  }

  const hours = Number(match[1]);
  const minutes = match[2] || '00';
  const sign = hours >= 0 ? '+' : '-';

  return `${sign}${pad2(Math.abs(hours))}:${minutes}`;
}

function formatParisDateTimeWithOffset(dateObj: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(dateObj);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value || '';

  const year = get('year');
  const month = get('month');
  const day = get('day');
  const hour = get('hour');
  const minute = get('minute');
  const second = get('second');

  const parisDate = `${year}-${month}-${day}`;
  const offset = getParisOffset(parisDate);

  return `${parisDate}T${hour}:${minute}:${second}${offset}`;
}

function buildCalendarDateTimes(date: string, slot: string, durationHours: number) {
  const offset = getParisOffset(date);
  const startDateTime = `${date}T${slot}:00${offset}`;

  const startDateObj = new Date(startDateTime);
  const endDateObj = new Date(
    startDateObj.getTime() + durationHours * 60 * 60 * 1000
  );

  const endDateTime = formatParisDateTimeWithOffset(endDateObj);

  return {
    startDateTime,
    endDateTime,
  };
}

function toCompactCalendarDate(dateTime: string) {
  const [datePart, timePart] = dateTime.split('T');

  return `${datePart.replace(/-/g, '')}T${timePart
    .replace(/:/g, '')
    .slice(0, 6)}`;
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function buildIcsContent(params: {
  uid: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  description: string;
}) {
  const dtStamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Talaref Studio//Reservation//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${escapeIcsText(params.uid)}`,
    `DTSTAMP:${dtStamp}`,
    `SUMMARY:${escapeIcsText(params.title)}`,
    `DTSTART;TZID=${TIME_ZONE}:${toCompactCalendarDate(params.startDateTime)}`,
    `DTEND;TZID=${TIME_ZONE}:${toCompactCalendarDate(params.endDateTime)}`,
    `LOCATION:${escapeIcsText(params.location)}`,
    `DESCRIPTION:${escapeIcsText(params.description)}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Rappel réservation Talaref Studio',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

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

    const {
      firstName = '',
      lastName = '',
      email = '',
      phone = '',
      siret = '',
      companyName = '',
      date = '',
      formattedDate = '',
      slot = '',
      duration = '1',
      paymentMode = 'full',
      service = '',
      message = '',
    } = session.metadata || {};

    if (!email || !date || !slot || !service) {
      return NextResponse.json(
        { error: 'Métadonnées de réservation incomplètes' },
        { status: 400 }
      );
    }

    const bgColor = '#f9fafb';
    const cardColor = '#ffffff';
    const textColor = '#333333';
    const lightTextColor = '#6b7280';
    const borderColor = '#e5e7eb';
    const buttonColor = '#000000';

    const amountPaid = session.amount_total ? session.amount_total / 100 : 0;

    const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;
    const latestCharge = paymentIntent?.latest_charge as Stripe.Charge | null;

    const finalReceiptUrl =
      latestCharge?.receipt_url || 'https://dashboard.stripe.com/test/payments';

    let paymentStatusAdmin = 'Plein tarif (100%)';
    let paymentStatusClientHtml = '';
    let remainingAmountStr = '0,00 €';

    let remainingAmountAdminHtml = `
      <p style="margin: 15px 0 5px 0; font-size: 14px; color: ${lightTextColor};">Reste à régler sur place</p>
      <p style="margin: 0 0 15px 0; font-weight: bold;">0,00 €</p>
    `;

    if (paymentMode === 'deposit') {
      paymentStatusAdmin = 'Acompte (30%)';

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

    let companyAddress = 'Adresse non renseignée';
    let companyBlockAdminHtml = '';

    if (siret) {
      try {
        const govRes = await fetch(
          `https://recherche-entreprises.api.gouv.fr/search?q=${siret}`
        );

        if (govRes.ok) {
          const govData = await govRes.json();

          if (govData.results && govData.results.length > 0) {
            companyAddress =
              govData.results[0].siege?.adresse || 'Adresse introuvable';
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'adresse SIRET :", err);
      }

      companyBlockAdminHtml = `
        <div style="border-top: 1px solid ${borderColor}; margin: 20px 0;"></div>

        <p style="margin: 15px 0 5px 0; font-size: 14px; color: ${lightTextColor};">Entreprise</p>
        <p style="margin: 0 0 15px 0; font-weight: bold;">${companyName}</p>

        <p style="margin: 15px 0 5px 0; font-size: 14px; color: ${lightTextColor};">SIRET</p>
        <p style="margin: 0 0 15px 0; font-weight: bold;">${siret}</p>

        <p style="margin: 15px 0 5px 0; font-size: 14px; color: ${lightTextColor};">Localisation</p>
        <p style="margin: 0 0 15px 0; font-weight: bold;">${companyAddress}</p>
      `;
    }

    const parsedDuration = Number(duration) || 1;
    const durationLabel = `${parsedDuration} ${parsedDuration > 1 ? 'heures' : 'heure'}`;

    const { startDateTime, endDateTime } = buildCalendarDateTimes(
      date,
      slot,
      parsedDuration
    );

    const calendarTitle = `📸 ${service} - ${firstName} ${lastName}`;
    const calendarLocation = siret ? companyAddress : STUDIO_ADDRESS;

    const calendarDescription = [
      `Prestation : ${service}`,
      `Client : ${firstName} ${lastName}`,
      `Email : ${email}`,
      `Téléphone : ${phone || 'Non renseigné'}`,
      siret ? `Entreprise : ${companyName} (SIRET : ${siret})` : '',
      siret ? `Adresse entreprise : ${companyAddress}` : '',
      '',
      `Type de paiement : ${paymentStatusAdmin}`,
      `Montant payé : ${amountPaid.toFixed(2)} €`,
      `Reste à régler : ${remainingAmountStr}`,
      '',
      `Message client : ${message || 'Aucun'}`,
    ]
      .filter(Boolean)
      .join('\n');

    const icsContent = buildIcsContent({
      uid: `${session.id}@talaref-studio`,
      title: calendarTitle,
      startDateTime,
      endDateTime,
      location: calendarLocation,
      description: calendarDescription,
    });

    const icsAttachmentBase64 = Buffer.from(icsContent, 'utf8').toString('base64');

    // --- SYNCHRONISATION GOOGLE CALENDAR ADMIN ---
    try {
      const calendar = createGoogleCalendarClient();

      await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID!.trim(),
        sendUpdates: 'none',
        requestBody: {
          summary: calendarTitle,
          location: calendarLocation,
          description: calendarDescription,
          status: 'confirmed',
          start: {
            dateTime: startDateTime,
            timeZone: TIME_ZONE,
          },
          end: {
            dateTime: endDateTime,
            timeZone: TIME_ZONE,
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 60 },
            ],
          },
        },
      });
    } catch (calendarError) {
      console.error(
        "Erreur lors de la création de l'événement Google Calendar admin :",
        calendarError
      );
    }

    // --- ENVOI MAIL ADMIN ---
    await brevo.transactionalEmails.sendTransacEmail({
      subject: `Nouvelle réservation : ${service} - ${firstName} ${lastName}`,
      htmlContent: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${bgColor}; color: ${textColor}; padding: 40px; text-align: center;">
          <div style="background-color: ${cardColor}; border: 1px solid ${borderColor}; padding: 30px; border-radius: 8px; text-align: left; max-width: 500px; margin: 0 auto;">
            <h2 style="margin-top: 0; font-size: 20px; color: ${textColor}; border-bottom: 1px solid ${borderColor}; padding-bottom: 15px;">Détails de la réservation</h2>

            <p style="margin: 15px 0 5px 0; font-size: 14px; color: ${lightTextColor};">Prestation</p>
            <p style="margin: 0 0 15px 0; font-weight: bold;">${service}</p>

            <p style="margin: 15px 0 5px 0; font-size: 14px; color: ${lightTextColor};">Client</p>
            <p style="margin: 0 0 15px 0; font-weight: bold;">${firstName} ${lastName} (<a href="mailto:${email}" style="color: ${textColor};">${email}</a>)</p>

            <p style="margin: 15px 0 5px 0; font-size: 14px; color: ${lightTextColor};">Numéro</p>
            <p style="margin: 0 0 15px 0; font-weight: bold;">📞 ${phone || 'Non renseigné'}</p>

            <p style="margin: 15px 0 5px 0; font-size: 14px; color: ${lightTextColor};">Date</p>
            <p style="margin: 0 0 15px 0; font-weight: bold;">${formattedDate || date} à ${slot}</p>

            <p style="margin: 15px 0 5px 0; font-size: 14px; color: ${lightTextColor};">Durée</p>
            <p style="margin: 0 0 15px 0; font-weight: bold;">${durationLabel}</p>

            ${companyBlockAdminHtml}

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
            Cette réservation a été ajoutée automatiquement au calendrier admin.
          </p>
        </div>
      `,
      sender: { name: 'Talaref Studio', email: 'contact@talaref.co' },
      to: [{ email: process.env.ADMIN_EMAIL! }],
    });

    // --- ENVOI MAIL CLIENT ---
    await brevo.transactionalEmails.sendTransacEmail({
      subject: 'Confirmation de votre réservation - Talaref Studio',
      htmlContent: `
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
                <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: bold;">${formattedDate || date} à ${slot}</p>

                <p style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; color: ${lightTextColor}; font-weight: bold; letter-spacing: 0.5px;">Durée</p>
                <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: bold;">${durationLabel}</p>

                ${
                  siret
                    ? `
                <p style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; color: ${lightTextColor}; font-weight: bold; letter-spacing: 0.5px;">Facturation Entreprise</p>
                <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: bold;">${companyName}<br><span style="font-size: 14px; font-weight: normal; color: ${lightTextColor};">SIRET : ${siret}</span></p>
                `
                    : ''
                }

                <p style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; color: ${lightTextColor}; font-weight: bold; letter-spacing: 0.5px;">Montant payé</p>
                <p style="margin: 0; font-size: 16px; font-weight: bold;">${amountPaid.toFixed(2).replace('.', ',')} €</p>

                ${paymentStatusClientHtml}
              </div>

              <div style="margin-bottom: 30px;">
                <p style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; color: ${lightTextColor}; font-weight: bold; letter-spacing: 0.5px;">Lieu du rendez-vous</p>
                <p style="margin: 0; font-size: 15px;">${STUDIO_ADDRESS}</p>
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
                Un fichier calendrier est joint à cet e-mail afin que vous puissiez ajouter facilement la réservation à votre agenda.<br><br>
                <strong>L'équipe Talaref Studio</strong>
              </p>
            </div>

          </div>
        </div>
      `,
      sender: { name: 'Talaref Studio', email: 'contact@talaref.co' },
      to: [{ email }],
      attachment: [
        {
          content: icsAttachmentBase64,
          name: 'reservation-talaref-studio.ics',
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur Confirmation:', error);

    return NextResponse.json(
      { error: 'Erreur lors de la confirmation' },
      { status: 500 }
    );
  }
}
