import { BrevoClient } from '@getbrevo/brevo'

const sender = { name: 'Talaref Studio', email: 'contact@talaref.co' }

export function getBrevoClient() {
  const apiKey = process.env.BREVO_API_KEY?.trim()

  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured')
  }

  return new BrevoClient({ apiKey })
}

export function getBrevoSender() {
  return sender
}

export function getAdminEmail() {
  const email = process.env.ADMIN_EMAIL?.trim()

  if (!email) {
    throw new Error('ADMIN_EMAIL is not configured')
  }

  return email
}