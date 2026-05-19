import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { calculateBookingPrice } from '@/lib/priceCalculator'; // <-- Vérifie juste que ce chemin correspond à ton projet

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // On récupère tout ce que le front envoie, y compris le téléphone et le SIRET !
    const {
      email, firstName, lastName, phone, siret, date, formattedDate,
      slot, duration, paymentMode, service, message, captchaToken
    } = body;

    // --- 1. SÉCURITÉ : VERIFICATION DU CAPTCHA ---
    const formData = new FormData();
    formData.append('secret', process.env.TURNSTILE_SECRET_KEY!);
    formData.append('response', captchaToken);

    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      return NextResponse.json({ error: 'Captcha invalide' }, { status: 400 });
    }

    // --- 2. SÉCURITÉ : VERIFICATION DU SIRET VIA L'ÉTAT ---
    let legalName = "";
    if (siret) {
      // On nettoie les espaces éventuels et on interroge l'API ouverte du gouvernement
      const siretClean = siret.replace(/\s/g, '');
      const siretRes = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${siretClean}`);
      const siretData = await siretRes.json();

      // Si l'API ne trouve rien, on bloque la transaction net
      if (!siretData.results || siretData.results.length === 0) {
         return NextResponse.json({ error: 'Numéro de SIRET invalide ou introuvable.' }, { status: 400 });
      }

      // On récupère le vrai nom officiel de la boîte
      legalName = siretData.results[0].nom_complet;
    }

    // --- 3. SÉCURITÉ : CALCUL DU PRIX CÔTÉ SERVEUR ---
    // Si un SIRET valide est passé, on applique les tarifs entreprise d'office
    const isEnterprise = !!siret;
    const parsedDuration = parseInt(duration) || 1;

    // Le serveur recalcule tout depuis zéro, impossible de tricher côté client !
    const totalBasePrice = calculateBookingPrice(service, parsedDuration, slot, isEnterprise);

    let finalTotalAmount = totalBasePrice;
    let paymentTitle = `Réservation : ${service}`;

    if (paymentMode === "deposit") {
      finalTotalAmount = totalBasePrice * 0.3;
      paymentTitle = `Acompte (30%) : ${service}`;
    }

    // On arrondit pour que Stripe ne crash pas avec des centimes à virgule
    const amountInCents = Math.round(finalTotalAmount * 100);

    // --- 4. CREATION DE LA SESSION STRIPE ---
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'link'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: paymentTitle,
              // On affiche la raison sociale de l'entreprise si elle existe
              description: `Client : ${firstName} ${lastName}${legalName ? ` (${legalName})` : ''} - Le ${formattedDate} à ${slot} (${duration}h)`,
            },
            unit_amount: amountInCents,
          },
          // Attention ici : quantity passe à 1 car 'amountInCents' contient déjà le total de toutes les heures
          quantity: 1,
        },
      ],
      mode: 'payment',

      // On balance tout dans les métadonnées pour que ton webhook api/confirm puisse les lire
      metadata: {
        firstName: firstName || "",
        lastName: lastName || "",
        email: email || "",
        phone: phone || "",
        siret: siret || "",
        companyName: legalName || "",
        date: date || "",
        formattedDate: formattedDate || "",
        slot: slot || "",
        duration: duration?.toString() || "1",
        paymentMode: paymentMode || "full",
        service: service || "",
        message: message || "Aucune information",
      },

      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/reservation`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("Erreur serveur/Stripe :", error);
    return NextResponse.json({ error: 'Erreur lors de la création du paiement' }, { status: 500 });
  }
}