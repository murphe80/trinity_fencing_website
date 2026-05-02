export default function PageHeroWatermark() {
  return (
    <div className="absolute inset-0 flex items-center justify-end pr-4 sm:pr-16 opacity-5 pointer-events-none select-none">
      <span className="font-heading text-white font-bold leading-none tracking-tight whitespace-nowrap text-[clamp(2.25rem,5vw+1.75rem,10rem)]">
        DUFC
      </span>
    </div>
  )
}
