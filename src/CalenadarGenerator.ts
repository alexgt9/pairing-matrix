export interface Event {
  start: Date;
  end: Date;
  summary: string;
  description: string;
  recurring_interval: number;
}

export const createEvents = (events: Event[]) => {
  const headersIcs =
    "BEGIN:VCALENDAR\n" +
    "CALSCALE:GREGORIAN\n" +
    "METHOD:PUBLISH\n" +
    "PRODID:-//Test Cal//EN\n" +
    "VERSION:2.0\n";
  const footersIcs = "END:VCALENDAR";

  const eventsIcs = events.map(createSingleEvent).join();

  return headersIcs + eventsIcs + footersIcs;
};

const createSingleEvent = (event: Event) => {
  return "BEGIN:VEVENT\n" +
  "UID:test-1\n" +
  "DTSTART;VALUE=DATE:" +
  convertDate(event.start) +
  "\n" +
  "DTEND;VALUE=DATE:" +
  convertDate(event.end) +
  "\n" +
  "SUMMARY:" +
  event.summary +
  "\n" +
  "DESCRIPTION:" +
  event.description +
  "\n" +
  "END:VEVENT\n";
};

const convertDate = (date: Date) => {
  var event = new Date(date).toISOString();
  event = event.split("T")[0];
  event = event.split("-").join("");
  
  return event;
}