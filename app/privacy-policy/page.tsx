import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage from '@/components/layout/LegalPage'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Dublin University Fencing Club handles website data, Google connections and tournament results.',
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How we handle information when you use the DUFC website and tournament tools."
    >
      <section>
        <h2>Who we are</h2>
        <p>
          This notice covers the website operated by Dublin University Fencing
          Club (DUFC), Trinity College Dublin, Ireland, including the
          Google-connected application called Trinity Fencing Website. Contact
          the club about this notice or your information at{' '}
          <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.
        </p>
      </section>
      <section>
        <h2>Information used by the website</h2>
        <ul>
          <li>
            Club information supplied through Google Sheets, Calendar and Drive,
            including committee and coach profiles, club contact details,
            photographs, achievements, events and policies, is used to publish
            the relevant website pages.
          </li>
          <li>
            The poule tracker uses the names, weapon, date and bout scores you
            enter to generate matches, PDFs and results. Tournament records can
            also contain weekly prize information from previously saved results.
          </li>
          <li>
            If you contact us by email, we receive your email address and the
            information you choose to send so that we can respond.
          </li>
          <li>
            The hosting service processes technical request information needed
            to deliver and protect the website. The site includes Vercel Web
            Analytics, which may collect page-view, browser and device
            information when enabled in the hosting environment.
          </li>
        </ul>
      </section>
      <section>
        <h2>Connecting your Google account</h2>
        <p>
          Google sign-in is optional and is used to save poule results directly
          to your personal Drive, the club folders, or both. You can browse the website, use
          the tracker, print a sheet and download a PDF without connecting
          Google.
        </p>
        <p>
          The connection requests Google&apos;s file-specific Drive permission
          (drive.file), allowing access to files the application creates and
          the club folders you select using Google Picker. Club uploads require Google to permit adding files to both folders. We do not request access
          to your entire Drive, Gmail or contacts, or change folder permissions.
        </p>
        <p>
          Google provides access and refresh tokens so the website can make
          those requests on your behalf. We do not receive your Google password.
          Tokens are held in an encrypted, HttpOnly browser cookie for up to 30
          days and are sent to the website server when needed; the server uses
          them with Google to complete uploads and refresh access. When folder
          selection is needed, a short-lived access token is passed to Google
          Picker in browser memory; it is not saved in local storage, and the
          refresh token remains in the encrypted, HttpOnly cookie.
        </p>
        <p>
          Separately, a club-configured Google connection reads the club&apos;s
          Sheets, Calendar and Drive content for the public website and league.
          This does not require visitors to connect their own accounts.
        </p>
      </section>
      <section>
        <h2>Saving and publishing results</h2>
        <p>
          Selecting Save results to Drive creates PDF and JSON copies in your
          chosen destination: personal My Drive, the club folders, or both.
          Personal-only copies are not shared with the club by the website and
          do not update the league. The club folders have public editing access;
          people with access can view and change the files. The club monitors
          uploads manually, without an approval step.
        </p>
        <p>
          If you save to the club folders and select Count towards Poules Tournament, eligible
          results are used for public league standings and weekly winners. These
          pages may show fencer names, scores, rankings, photographs and
          recorded prize information. Make sure participants know how their
          results will be used before submitting them.
        </p>
        <p>
          Downloading a PDF sends the poule data to the website server to
          generate the file but does not save it to Drive or publish it to the
          tournament.
        </p>
      </section>
      <section>
        <h2>Storage, retention and your controls</h2>
        <ul>
          <li>
            Your current poule draft stays in this browser&apos;s local storage
            until you start a new poule or clear the site&apos;s browser data.
            Take care when using a shared device.
          </li>
          <li>
            A sign-in security cookie expires after 10 minutes. The Google
            connection cookie lasts up to 30 days and can be cleared using
            Disconnect Google in the tracker.
          </li>
          <li>
            You can also revoke the website&apos;s Google access through your{' '}
            <a href="https://myaccount.google.com/connections">
              Google Account connections
            </a>
            . Disconnecting or revoking access does not delete results already
            uploaded.
          </li>
          <li>
            Uploaded results remain in the
            club&apos;s Google storage until removed by an authorised organiser;
            the website does not automatically delete them at the end of a
            season. Contact the club to request correction or removal, including
            from the public league.
          </li>
          <li>
            Copies you download are under your control. Deleting a club record
            cannot recall copies that other people have already downloaded.
          </li>
        </ul>
      </section>
      <section>
        <h2>Sharing and external services</h2>
        <p>
          Google processes information for sign-in, storage and the embedded
          events calendar; Render hosts the deployed website. These services
          process data as needed to provide their functionality and may process
          information outside Ireland. Their own privacy notices describe their
          processing and applicable international-transfer safeguards.
        </p>
        <p>
          The embedded Google Calendar may receive technical information and use
          cookies according to{' '}
          <a href="https://policies.google.com/privacy">
            Google&apos;s Privacy Policy
          </a>
          . Newsletter registration is handled on Mailchimp&apos;s external
          signup page, and membership and shop links lead to external providers.
          Information you submit on those services is governed by their own
          notices; website terms are available on our{' '}
          <Link href="/terms-of-service">Terms of Service</Link> page.
        </p>
        <p>
          We do not sell Google user data, use it for advertising or use it to
          train general-purpose artificial intelligence models. Our use and
          transfer of information received from Google APIs adheres to the{' '}
          <a href="https://developers.google.com/terms/api-services-user-data-policy">
            Google API Services User Data Policy
          </a>
          , including its Limited Use requirements.
        </p>
      </section>
      <section>
        <h2>Your privacy rights and requests</h2>
        <p>
          Depending on the circumstances and applicable data-protection law, you
          may request access to, correction or deletion of your personal
          information, restriction of processing or a portable copy, and may
          object to processing. Where processing relies on consent, you can
          withdraw it without affecting processing that already took place.
        </p>
        <p>
          Email <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>{' '}
          with your request and enough detail for us to identify the relevant
          record. You can also raise a concern with Ireland&apos;s{' '}
          <a href="https://www.dataprotection.ie/en/individuals/rights-individuals-under-general-data-protection-regulation">
            Data Protection Commission
          </a>
          .
        </p>
      </section>
      <section>
        <h2>Changes to this notice</h2>
        <p>
          We will update this page when the website&apos;s data handling
          changes. New uses of Google account information will be disclosed
          before they begin, with renewed permission requested where required.
        </p>
      </section>
    </LegalPage>
  )
}
