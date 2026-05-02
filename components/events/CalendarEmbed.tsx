export default function CalendarEmbed() {
  return (
    <div className="rounded-lg overflow-hidden border border-grey-light shadow-sm">
      <iframe
        src="https://calendar.google.com/calendar/embed?src=dufencing%40gmail.com&ctz=Europe%2FDublin&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0&bgcolor=%23C8102E"
        style={{ border: 0 }}
        width="100%"
        height="600"
        scrolling="no"
        title="DUFC Google Calendar"
      />
    </div>
  )
}
