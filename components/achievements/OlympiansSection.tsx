const OLYMPIANS = [
  {
    name: 'Patrick Duffy',
    discipline: 'Foil & Épée',
    years: '1948 & 1952 Olympics',
    note: 'Head Coach 1952–1987',
  },
  {
    name: 'Harry Thuillier',
    discipline: 'Foil',
    years: '1952 & 1960 Olympics',
    note: '',
  },
  {
    name: 'Shirley Armstrong',
    discipline: "Women's Foil",
    years: '1960 Olympics',
    note: 'First Irish woman to fence at the Olympics',
  },
  {
    name: 'Brian Hamilton',
    discipline: 'Individual Foil & Team Épée',
    years: '1960 Olympics',
    note: '',
  },
  {
    name: 'Colm Murrogh Vere O\'Brien',
    discipline: 'Épée',
    years: '1968 Olympics',
    note: '',
  },
  {
    name: 'Natalya Coyle',
    discipline: 'Modern Pentathlon',
    years: '2012, 2016 & 2020 Olympics',
    note: '3× Olympian, Honorary Member',
  },
]

export default function OlympiansSection() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl md:text-4xl font-semibold text-black mb-3">
          DUFC Olympians
        </h2>
        <p className="font-body text-white/60 mb-10">
          Six DUFC members have represented Ireland at the Olympic Games.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {OLYMPIANS.map(olympian => (
            <div key={olympian.name} className="bg-black-soft rounded-lg p-6 border border-white/10">
              <div className="text-gold font-body text-xs uppercase tracking-widest mb-2">
                {olympian.years}
              </div>
              <h3 className="font-heading text-xl text-white font-medium">{olympian.name}</h3>
              <p className="font-body text-sm text-white/60 mt-1">{olympian.discipline}</p>
              {olympian.note && (
                <p className="font-body text-xs text-white/40 mt-2 italic">{olympian.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
