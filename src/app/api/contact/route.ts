import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, service, message } = body

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Veuillez remplir tous les champs obligatoires' },
                { status: 400 }
            )
        }

        // Envoi de l'email
        const { data, error } = await resend.emails.send({
            from: 'Talaref Studio <contact@talaref.co>',
            to: ['contact@toshh.fr'],
            replyTo: email,
            subject: `Nouveau message de ${name} - ${service}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #c8ff00; background: #001829; padding: 20px; border-radius: 10px;">
            Nouveau message depuis Talaref Studio
          </h2>
          
          <div style="padding: 20px; background: #f5f5f5; border-radius: 10px; margin-top: 20px;">
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Service:</strong> ${service}</p>
            <hr style="border: 1px solid #ddd; margin: 20px 0;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Ce message a été envoyé depuis le formulaire de contact de talaref.co
          </p>
        </div>
      `,
        })

        if (error) {
            console.error('Resend error:', error)
            return NextResponse.json(
                { error: 'Erreur lors de l\'envoi du message' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('Contact API error:', error)
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        )
    }
}
