type MailRecipient = {
  email: string
  name?: string
}

type MailAttachment = {
  content: string
  name: string
  contentType?: string
}

type MailjetEmail = {
  sender: MailRecipient
  to: MailRecipient[]
  subject: string
  htmlContent: string
  replyTo?: MailRecipient
  attachment?: MailAttachment[]
}

function toMailjetRecipient(recipient: MailRecipient) {
  return {
    Email: recipient.email,
    ...(recipient.name ? { Name: recipient.name } : {}),
  }
}

function getMailjetCredentials() {
  const apiKey = (process.env.MAILJET_API_KEY || process.env.mailjet_api_key)?.trim()
  const apiSecret = (process.env.MAILJET_API_SECRET || process.env.mailjet_api_secret)?.trim()

  if (!apiKey || !apiSecret) {
    throw new Error('Mailjet credentials are not configured')
  }

  return { apiKey, apiSecret }
}

export function getMailjetSender() {
  return {
    name: process.env.MAILJET_SENDER_NAME?.trim() || 'Talaref Studio',
    email: process.env.MAILJET_SENDER_EMAIL?.trim() || 'contact@talaref.co',
  }
}

export function getAdminEmail() {
  const email = process.env.ADMIN_EMAIL?.trim()

  if (!email) {
    throw new Error('ADMIN_EMAIL is not configured')
  }

  return email
}

export async function sendMailjetEmail({
  sender,
  to,
  subject,
  htmlContent,
  replyTo,
  attachment,
}: MailjetEmail) {
  const { apiKey, apiSecret } = getMailjetCredentials()
  const authorization = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')

  const response = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authorization}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Messages: [
        {
          From: toMailjetRecipient(sender),
          To: to.map(toMailjetRecipient),
          ...(replyTo ? { ReplyTo: toMailjetRecipient(replyTo) } : {}),
          Subject: subject,
          HTMLPart: htmlContent,
          ...(attachment
            ? {
                Attachments: attachment.map((file) => ({
                  ContentType: file.contentType || 'text/calendar',
                  Filename: file.name,
                  Base64Content: file.content,
                })),
              }
            : {}),
        },
      ],
    }),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Mailjet request failed (${response.status}): ${details}`)
  }

  return response.json()
}