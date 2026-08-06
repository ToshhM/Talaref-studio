import { NextRequest, NextResponse } from 'next/server'
import { BrevoClient } from '@getbrevo/brevo'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { getCongoEventDate } from '@/lib/eventDate'

const SLOT_PATTERN = /^([01]\d|2[0-3]):(00|20|40)$/
const PHONE_PATTERN = /^[+()0-9\s.-]{6,30}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function GET() {
  const eventDate = getCongoEventDate()

  const { data, error } = await supabaseAdmin
    .from('event_bookings')
    .select('slot')
    .eq('event_date', eventDate.iso)
    .eq('status', 'confirmed')

  if (error) {
    console.error('Event booking slots fetch error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  return NextResponse.json({ takenSlots: (data || []).map((row) => row.slot) })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const firstName = String(body.firstName || '').trim().slice(0, 80)
    const lastName = String(body.lastName || '').trim().slice(0, 80)
    const email = String(body.email || '').trim().slice(0, 254).toLowerCase()
    const phone = String(body.phone || '').trim().slice(0, 30)
    const slot = String(body.slot || '').trim()
    const message = String(body.message || '').trim().slice(0, 1000)

    if (!firstName || !lastName || !email || !phone || !slot) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires.' },
        { status: 400 }
      )
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 })
    }

    if (!PHONE_PATTERN.test(phone)) {
      return NextResponse.json({ error: 'Numéro de téléphone invalide.' }, { status: 400 })
    }

    if (!SLOT_PATTERN.test(slot)) {
      return NextResponse.json({ error: 'Créneau invalide.' }, { status: 400 })
    }

    const eventDate = getCongoEventDate()

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('event_bookings')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        event_date: eventDate.iso,
        slot,
        message: message || null,
      })
      .select('id')
      .single()

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: "Ce créneau vient d'être réservé. Choisissez-en un autre." },
          { status: 409 }
        )
      }
      console.error('Event booking insert error:', insertError)
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement de la réservation." },
        { status: 500 }
      )
    }

    const apiKey = process.env.BREVO_API_KEY
    if (apiKey) {
      const brevo = new BrevoClient({ apiKey })

      try {
        await brevo.transactionalEmails.sendTransacEmail({
          sender: { name: 'Talaref Studio', email: 'contact@talaref.co' },
          to: [{ email: 'contact@talaref.co' }],
          replyTo: { email, name: `${firstName} ${lastName}` },
          subject: `Shooting Day Congolais - ${firstName} ${lastName} - ${slot}`,
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #c8ff00; background: #001829; padding: 20px; border-radius: 10px;">
                Nouvelle réservation - Shooting Day Spécial Congolais
              </h2>

              <div style="padding: 20px; background: #f5f5f5; border-radius: 10px; margin-top: 20px;">
                <p><strong>Nom:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Téléphone:</strong> ${phone}</p>
                <p><strong>Date:</strong> ${eventDate.label}</p>
                <p><strong>Créneau:</strong> ${slot} (20 min)</p>
                ${message ? `<hr style="border: 1px solid #ddd; margin: 20px 0;"><p><strong>Message:</strong></p><p style="white-space: pre-wrap;">${message}</p>` : ''}
              </div>

              <p style="color: #666; font-size: 12px; margin-top: 20px;">
                Réservation gérable depuis /admin/bookings sur talaref.co
              </p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Event booking admin email error:', emailError)
      }

      try {
        await brevo.transactionalEmails.sendTransacEmail({
          sender: { name: 'Talaref Studio', email: 'contact@talaref.co' },
          to: [{ email, name: `${firstName} ${lastName}` }],
          subject: `Confirmation - Shooting Day Congolais du ${eventDate.label}`,
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #c8ff00; background: #001829; padding: 20px; border-radius: 10px;">
                Votre créneau est confirmé !
              </h2>

              <div style="padding: 20px; background: #f5f5f5; border-radius: 10px; margin-top: 20px;">
                <p>Bonjour ${firstName},</p>
                <p>Votre réservation pour le <strong>Shooting Day Spécial Congolais</strong> est bien enregistrée.</p>
                <p><strong>Date:</strong> ${eventDate.label}</p>
                <p><strong>Créneau:</strong> ${slot} (20 min)</p>
              </div>

              <p style="color: #666; font-size: 12px; margin-top: 20px;">
                Besoin de modifier ou annuler votre créneau ? Répondez simplement à cet email.
              </p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Event booking client email error:', emailError)
      }
    }

    return NextResponse.json({ success: true, id: inserted?.id })
  } catch (error) {
    console.error('Event booking API error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
