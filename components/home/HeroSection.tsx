import Image from 'next/image'
import Button from '@/components/ui/Button'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background action shot */}
      <Image
        src="/images/action_shot.jpg"
        alt="DUFC fencer in action"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark overlay — enough to keep text legible, not so dark the image disappears */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75" />

      {/* Decorative diagonal stripe at the bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-cream"
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <Image
          src="/images/crest_white.png"
          alt="DUFC crest"
          width={120}
          height={120}
          className="mx-auto mb-8 opacity-90"
          priority
        />

        {/* Tight leading — high-end magazine cover feel */}
        <h1
          className="font-heading text-white font-semibold tracking-tight"
          style={{
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            lineHeight: 0.92,
          }}
        >
          Dublin University<br />Fencing Club
        </h1>

        <p className="text-white/75 text-lg md:text-xl mt-8 max-w-xl mx-auto leading-relaxed font-body">
          Ireland&apos;s oldest university fencing club.&ensp;Est.&nbsp;1774.
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
