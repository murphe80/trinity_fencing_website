import Image from 'next/image'
import Button from '@/components/ui/Button'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background — replace with Image component once hero.jpg is available */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black-soft to-red/20" />
      {/* Uncomment below when /public/images/hero.jpg is present:
      <Image
        src="/images/hero.jpg"
        alt="DUFC fencing"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/60" /> */}

      {/* Decorative diagonal stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-cream" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <Image src="/images/crest.png" alt="DUFC crest" width={150} height={150} className="mx-auto mb-8" priority />

        <h1 className="font-heading text-white text-5xl md:text-7xl font-semibold leading-tight">
          Dublin University<br />Fencing Club
        </h1>

        <p className="text-white/80 text-lg md:text-xl mt-6 max-w-xl mx-auto leading-relaxed">
          Ireland&apos;s oldest university fencing club. Est. 1774.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/membership" variant="primary" size="md">
            Join the Club
          </Button>
          <Button href="#about" variant="outline-white" size="md">
            Our Story
          </Button>
        </div>
      </div>
    </section>
  )
}
