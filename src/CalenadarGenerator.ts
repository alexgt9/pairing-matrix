export interface CalendarEvent {
  start: Date;
  end: Date;
  summary: string;
  description: string;
  recurring_interval: number;
  until_date?: Date;
}

export const createEvents = (events: CalendarEvent[]) => {
  const headersIcs =
    "BEGIN:VCALENDAR\n" +
    "CALSCALE:GREGORIAN\n" +
    "METHOD:PUBLISH\n" +
    "PRODID:-//Test Cal//EN\n" +
    "VERSION:2.0\n";
  const footersIcs = "END:VCALENDAR";

  const eventsIcs = events.map(createSingleEvent).join("");

  return headersIcs + eventsIcs + footersIcs;
};

const createSingleEvent = (event: CalendarEvent, index: number) => {
  const uid = `pairing-session-${index}`;
  const rrule = ["FREQ=WEEKLY", `INTERVAL=${event.recurring_interval}`];
  event.until_date && rrule.push(`UNTIL=${convertDate(event.until_date)}`);

  return "BEGIN:VEVENT\n" +
  `UID:${uid}\n` +
  `DTSTART;VALUE=DATE:${convertDate(event.start)}\n` +
  `DTEND;VALUE=DATE:${convertDate(event.end)}\n` +
  `RRULE:${rrule.join(";")}\n` +
  `SUMMARY:${event.summary}\n` +
  `DESCRIPTION:${event.description}\\n\\nUID: ${uid}\n` +
  "END:VEVENT\n";
};

const convertDate = (date: Date) => {
  var event = new Date(date).toISOString();
  event = event.split("T")[0];
  event = event.split("-").join("");
  
  return event;
}