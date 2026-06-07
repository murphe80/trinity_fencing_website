#!/usr/bin/env node

/**
 * Interactive script to refresh your Google OAuth token
 *
 * Run: node scripts/refresh-google-token.js
 *
 * This will guide you through:
 * 1. Generating an authorization URL
 * 2. Getting a new refresh token
 * 3. Updating your .env.local file
 */

const { google } = require('googleapis')
const readline = require('readline')
const fs = require('fs')
const path = require('path')

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
]

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function main() {
  console.log('='.repeat(60))
  console.log('Google OAuth Refresh Token Generator')
  console.log('='.repeat(60))
  console.log()

  // Read current credentials from .env.local
  const envPath = path.join(__dirname, '..', '.env.local')
  let currentClientId = ''
  let currentClientSecret = ''

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const clientIdMatch = envContent.match(/GOOGLE_CLIENT_ID=(.+)/)
    const clientSecretMatch = envContent.match(/GOOGLE_CLIENT_SECRET=(.+)/)

    if (clientIdMatch) currentClientId = clientIdMatch[1].trim()
    if (clientSecretMatch) currentClientSecret = clientSecretMatch[1].trim()
  }

  // Ask for credentials
  const clientId = await question(
    `Enter GOOGLE_CLIENT_ID${currentClientId ? ` [${currentClientId}]` : ''}: `
  ) || currentClientId

  const clientSecret = await question(
    `Enter GOOGLE_CLIENT_SECRET${currentClientSecret ? ' [current value]' : ''}: `
  ) || currentClientSecret

  if (!clientId || !clientSecret) {
    console.error('\n❌ Client ID and Secret are required!')
    rl.close()
    return
  }

  // Create OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'http://localhost' // This redirect URI must be configured in Google Cloud Console
  )

  // Generate auth URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // Force consent screen to get a refresh token
  })

  console.log('\n' + '='.repeat(60))
  console.log('STEP 1: Authorize the application')
  console.log('='.repeat(60))
  console.log('\n1. Open this URL in your browser:')
  console.log('\n' + authUrl)
  console.log('\n2. Log in with dufencing@gmail.com')
  console.log('3. Grant all requested permissions')
  console.log('4. You will be redirected to a URL that looks like:')
  console.log('   http://localhost/?code=AUTHORIZATION_CODE&scope=...')
  console.log('5. Copy the AUTHORIZATION_CODE from the URL')
  console.log()

  const code = await question('Paste the authorization code here: ')

  if (!code) {
    console.error('\n❌ Authorization code is required!')
    rl.close()
    return
  }

  try {
    // Exchange code for tokens
    console.log('\nExchanging authorization code for tokens...')
    const { tokens } = await oauth2Client.getToken(code)

    if (!tokens.refresh_token) {
      console.error('\n❌ No refresh token received!')
      console.log('This can happen if you\'ve already authorized this app.')
      console.log('Try revoking access at: https://myaccount.google.com/permissions')
      console.log('Then run this script again.')
      rl.close()
      return
    }

    console.log('\n✅ Success! Got new refresh token.')
    console.log('\n' + '='.repeat(60))
    console.log('STEP 2: Update environment variables')
    console.log('='.repeat(60))
    console.log('\nAdd this to your .env.local file:')
    console.log('\nGOOGLE_REFRESH_TOKEN=' + tokens.refresh_token)
    console.log('\n' + '='.repeat(60))
    console.log('STEP 3: Update Vercel environment variables')
    console.log('='.repeat(60))
    console.log('\n1. Go to: https://vercel.com/dashboard')
    console.log('2. Select your project')
    console.log('3. Go to Settings → Environment Variables')
    console.log('4. Update GOOGLE_REFRESH_TOKEN with the value above')
    console.log('5. Redeploy your site')
    console.log()

    // Optionally update .env.local
    const shouldUpdate = await question('Update .env.local automatically? (y/n): ')

    if (shouldUpdate.toLowerCase() === 'y') {
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8')

        // Replace or add refresh token
        if (envContent.includes('GOOGLE_REFRESH_TOKEN=')) {
          envContent = envContent.replace(
            /GOOGLE_REFRESH_TOKEN=.*/,
            `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`
          )
        } else {
          envContent += `\nGOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`
        }

        fs.writeFileSync(envPath, envContent)
        console.log('\n✅ .env.local updated!')
      }
    }

    console.log('\n✨ All done! Remember to update Vercel env vars too.')
    console.log()

  } catch (error) {
    console.error('\n❌ Error exchanging code for token:', error.message)
  }

  rl.close()
}

main()
