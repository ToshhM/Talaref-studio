import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  calculateExpectedPaymentAmount,
  getConfiguredSiteUrl,
  parseBookingInput,
} from '@/lib/bookingSecurity';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

function formatAmountForMetadata(value: number): string {
  return value.toFixed(2);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const booking = parseBookingInput(body);
    const captchaToken =
      typeof body.captchaToken === 'string' ? body.captchaToken.trim() : '';

    if (!captchaToken || captchaToken.length > 2048) {
      return NextResponse.json({ error: 'Captcha manquant.' }, { status: 400 });
    }

    const formData = new FormData();
    formData.append('secret', process.env.TURNSTILE_SECRET_KEY!);
    formData.append('response', captchaToken);

    const verifyResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      return NextResponse.json({ error: 'Captcha invalide.' }, { status: 400 });
    }

    let legalName = '';

    if (booking.siret) {
      const siretRes = await fetch(
        `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(
          booking.siret
        )}`
      );

      if (!siretRes.ok) {
        return NextResponse.json(
          { error: 'Impossible de verifier le numero de SIRET pour le moment.' },
          { status: 400 }
        );
      }

      const siretData = await siretRes.json();

      if (!siretData.results || siretData.results.length === 0) {
        return NextResponse.json(
          { error: 'Numero de SIRET invalide ou introuvable.' },
          { status: 400 }
        );
      }

      legalName = String(siretData.results[0].nom_complet || '').slice(0, 160);
    }

    const expectedAmount = calculateExpectedPaymentAmount(booking);
    const amountInCents = expectedAmount.amountInCents;

    if (!Number.isInteger(amountInCents) || amountInCents <= 0) {
      return NextResponse.json(
        { error: 'Montant de paiement invalide.' },
        { status: 400 }
      );
    }

    const paymentTitle =
      booking.paymentMode === 'deposit'
        ? `Acompte (30%) : ${booking.service}`
        : `Reservation : ${booking.service}`;
    const siteUrl = getConfiguredSiteUrl(req.headers.get('origin'));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'link'],
      customer_email: booking.email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: paymentTitle,
              description: `Client : ${booking.firstName} ${booking.lastName}${
                legalName ? ` (${legalName})` : ''
              } - Le ${booking.formattedDate || booking.date} a ${booking.slot} (${
                booking.duration
              }h)`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        firstName: booking.firstName,
        lastName: booking.lastName,
        email: booking.email,
        phone: booking.phone,
        siret: booking.siret,
        companyName: legalName,
        date: booking.date,
        formattedDate: booking.formattedDate,
        slot: booking.slot,
        duration: booking.duration.toString(),
        paymentMode: booking.paymentMode,
        service: booking.service,
        message: booking.message || 'Aucune information',
        baseAmount: formatAmountForMetadata(expectedAmount.baseAmount),
        paidAmount: formatAmountForMetadata(expectedAmount.paidAmount),
      },
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/reservation`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Impossible de generer le lien de paiement.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erreur serveur/Stripe :', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la creation du paiement.',
      },
      { status: 500 }
    );
  }
}
