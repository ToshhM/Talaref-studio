import { NextResponse } from 'next/server'
import { getAdminEmail, getMailjetSender, sendMailjetEmail } from '@/lib/mailjet'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

type BookingType = 'studio' | 'congo'

type BookingData = {
  first_name: string
  last_name: string
  email: string
}

const GOOGLE_REVIEW_URL = 'https://g.page/r/Ca4Br1AyeymDEAE/review'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const type = body.type as BookingType
  const id = typeof body.id === 'string' ? body.id : ''

  if (!id || !['studio', 'congo'].includes(type)) {
    return NextResponse.json({ error: 'Réservation invalide.' }, { status: 400 })
  }

  const table = type === 'studio' ? 'studio_bookings' : 'event_bookings'
  const { data, error } = await supabaseAdmin
    .from(table)
    .select('id, first_name, last_name, email')
    .eq('id', id)
    .single()
  const booking = data as BookingData | null

  if (error || !booking) {
    return NextResponse.json({ error: 'Réservation introuvable.' }, { status: 404 })
  }

  const firstName = escapeHtml(booking.first_name)
  const sentAt = new Date().toISOString()

  try {
    await sendMailjetEmail({
      sender: getMailjetSender(),
      to: [{ email: booking.email, name: `${booking.first_name} ${booking.last_name}` }],
      replyTo: { email: getAdminEmail(), name: 'TALAREF Studio' },
      subject: 'Merci pour votre passage chez TALAREF ✨',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #172033; line-height: 1.6;">
          <h2 style="color: #001829;">Merci pour votre passage chez TALAREF ✨</h2>
          <p>Bonjour <strong>${firstName}</strong>,</p>
          <p>Merci d’être passé(e) chez <strong>TALAREF Studio</strong> ! Nous espérons que votre séance s’est bien déroulée et que vous avez apprécié votre expérience au studio.</p>
          <p>Votre retour nous aide énormément à améliorer le studio, le matériel mis à disposition et la qualité de notre accueil.</p>
          <p><strong>Comment s’est passée votre expérience chez TALAREF ?</strong></p>
          <p>Vous pouvez simplement répondre à cet e-mail pour nous partager votre retour.</p>
          <p>Et si vous avez apprécié votre passage, vous pouvez également nous laisser un <strong>avis Google</strong>. Cela ne prend qu’une minute et nous aide beaucoup à faire connaître le studio :</p>
          <p style="margin: 28px 0; text-align: center;">
            <a href="${GOOGLE_REVIEW_URL}" style="display: inline-block; background: #c8ff00; color: #001829; padding: 14px 22px; border-radius: 6px; font-weight: bold; text-decoration: none;">Donner mon avis sur Google</a>
          </p>
          <p>Merci encore pour votre confiance et au plaisir de vous accueillir de nouveau pour un prochain shooting ou tournage.</p>
          <p><strong>L’équipe TALAREF Studio</strong><br>5 Rue Bellanger<br>92300 Levallois-Perret<br><br>📸 <a href="https://www.instagram.com/talarefstudio/?utm_source=chatgpt.com">@talarefstudio</a></p>
        </div>
      `,
    })
  } catch (mailjetError) {
    console.error('Review email error:', mailjetError)
    return NextResponse.json({ error: 'Le mail d’avis n’a pas pu être envoyé.' }, { status: 502 })
  }

  const { error: trackingError } = await supabaseAdmin
    .from(table)
    .update({ review_email_sent_at: sentAt })
    .eq('id', id)

  if (trackingError) {
    console.error('Review email tracking update error:', trackingError)
  }

  return NextResponse.json({ success: true, sentAt })
}
