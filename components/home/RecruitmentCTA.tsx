import Button from '@/components/ui/Button'

export default function RecruitmentCTA() {
  return (
    <section className="bg-black py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-white text-4xl md:text-5xl font-semibold">
          New to Fencing?
        </h2>
        <p className="font-body text-white/70 text-lg mt-6 leading-relaxed">
          No experience needed. We welcome beginners of all ages. Join us at training and try it for yourself.
        </p>
        <div className="mt-10">
          <Button href="/membership" variant="primary" size="md">
            Find Out How to Join
          </Button>
        </div>
      </div>
    </section>
  )
}
