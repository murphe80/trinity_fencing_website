import Image from 'next/image'
import { SITE_CONFIG } from '@/lib/constants'

export default function AboutSection() {
  return (
    <section id="about" className="bg-cream py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text */}
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-black mb-6">
              Club History
            </h2>
            <div className="space-y-4 font-body text-grey-dark leading-relaxed">
              <p>
                Dublin University Fencing Club is the fencing club of Trinity College Dublin,
                catering for foil, épée, and sabre. While the modern club was established in 1936,
                fencing at Trinity has a history stretching back to 1730, when students formed the
                Gentleman&apos;s Club of the Sword.
              </p>
              <p>
                In 1774, Provost John Hely-Hutchinson formally established fencing in the college,
                employing a dedicated fencing master and designating the Senate House for practice.
              </p>
              <p>
                Today, DUFC is one of Ireland&apos;s premier fencing clubs, consistently topping the
                national club medal table, producing six Olympians, and welcoming students, alumni,
                and staff from Trinity College.
              </p>
            </div>
            <a
              href={SITE_CONFIG.wikipediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 font-body text-sm text-red font-medium hover:text-red-dark transition-colors"
            >
              Read more on Wikipedia →
            </a>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src="/images/about.jpg"
                alt="DUFC training"
                fill
                className="object-cover"
              />
            </div>
            {/* Red accent block */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-red rounded-lg -z-10" />
          </div>

        </div>
      </div>
    </section>
  )
}
