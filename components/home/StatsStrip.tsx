const STATS = [
  { value: '1774', label: 'Founded' },
  { value: '6', label: 'Olympians' },
  { value: '3', label: 'Weapons' },
  { value: '2017 & 2025', label: 'Club of the Year' },
]

export default function StatsStrip() {
  return (
    <section className="bg-red py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-white text-4xl md:text-5xl font-semibold">
                {stat.value}
              </div>
              <div className="font-body text-white/80 text-sm uppercase tracking-wide mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
