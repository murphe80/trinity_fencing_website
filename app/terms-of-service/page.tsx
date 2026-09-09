import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage from '@/components/layout/LegalPage'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms for using the Dublin University Fencing Club website and tournament tools.',
}

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" description="Using the DUFC website, poule tracker and tournament results.">
      <section>
        <h2>About this website</h2>
        <p>Dublin University Fencing Club (DUFC), Trinity College Dublin, Ireland, provides this website for club information, events and tournament administration. These terms apply to your use of its website tools; membership, purchases and participation in fencing activities may have separate conditions.</p>
      </section>
      <section>
        <h2>Using the website responsibly</h2>
        <p>Use the website lawfully and respect other people&apos;s privacy. Do not submit false results, impersonate another person, upload material you are not entitled to share, attempt unauthorised access or interfere with the website&apos;s operation.</p>
        <p>When entering other participants&apos; information, ensure you are authorised to do so and that they understand how their information will be saved and, where applicable, published.</p>
      </section>
      <section>
        <h2>Google connections and uploads</h2>
        <p>You may connect a Google account that you are authorised to use. Saving results requires that account to have permission to add files to both designated club folders. Keep access to your account and device secure, and disconnect Google when you finish using a shared device.</p>
        <p>By selecting Save results to Drive, you instruct the website to create PDF and JSON copies of the current poule in those folders. Check the names, date, weapon and scores before saving. When you mark a poule for The Wheel Tournament, eligible results contribute to the public league and weekly archive.</p>
        <p>Check the confirmation message after an upload. A failed or interrupted save may leave only a PDF copy, and retrying can create an additional revision. Keep a downloaded copy if you need your own record.</p>
      </section>
      <section>
        <h2>Results, availability and corrections</h2>
        <p>The tracker supports club tournament administration. Organisers remain responsible for checking results and resolving scoring or eligibility disputes. Event details and published standings may change or be corrected.</p>
        <p>We aim to keep the website accurate and available, but access depends on hosting, Google services and network availability. Features may be interrupted or changed. Nothing in these terms excludes rights or responsibilities that cannot lawfully be excluded.</p>
      </section>
      <section>
        <h2>Club content and external services</h2>
        <p>Club branding, photographs and other content belong to their respective owners. Contact the club before reusing material beyond what the law permits. Submitting results allows DUFC to store and display them for the club and tournament purposes described in the <Link href="/privacy-policy">Privacy Policy</Link>; it does not transfer ownership of your content.</p>
        <p>Google, newsletter, membership, shop and other linked services operate under their own terms and privacy notices. Following an external link does not make DUFC the operator of that service.</p>
      </section>
      <section>
        <h2>Contact and updates</h2>
        <p>For questions, corrections or problems, contact <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>. We may revise these terms as the website changes; the date at the top identifies the latest version.</p>
      </section>
    </LegalPage>
  )
}
