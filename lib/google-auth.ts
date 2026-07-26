
// Preferred environment variable:
//   GOOGLE_SERVICE_ACCOUNT_JSON
//
// Legacy OAuth fallback:
//   GOOGLE_CLIENT_ID
//   GOOGLE_CLIENT_SECRET
//   GOOGLE_REFRESH_TOKEN

import { google } from 'googleapis'

const GOOGLE_API_SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
]

type ServiceAccountCredentials = {
  client_email?: string
  private_key?: string
}

export function getGoogleAuthClient() {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON

  if (serviceAccountJson) {
    let credentials: ServiceAccountCredentials

    try {
      credentials = JSON.parse(serviceAccountJson) as ServiceAccountCredentials
    } catch {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON')
    }

    const clientEmail = credentials.client_email
    const privateKey = credentials.private_key?.replace(/\\n/g, '\n')

    if (!clientEmail || !privateKey) {
      throw new Error(
        'GOOGLE_SERVICE_ACCOUNT_JSON must include client_email and private_key'
      )
    }

    return new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: GOOGLE_API_SCOPES,
    })
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Google credentials are not configured. ' +
      'Set GOOGLE_SERVICE_ACCOUNT_JSON, or set legacy GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN in .env.local'
    )
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret)
  auth.setCredentials({ refresh_token: refreshToken })
  return auth
}
