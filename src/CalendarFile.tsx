import { useState } from "react";
import { CalendarEvent, createEvents } from "./CalendarGenerator";
import { PairingDay } from "./PairingApp";
import { Pair } from "./types";

export interface CalendarFileProps {
  days: PairingDay[];
  repeatEveryNWeeks: number;
  description: string;
  untilDate?: Date;
}

const CalendarFile = ({ days, repeatEveryNWeeks, description, untilDate }: CalendarFileProps) => {
  const [fileUrl, setFileUrl] = useState("");
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  const makeIcsFile = (days: PairingDay[]) => {
    const events = days.map((day: PairingDay) => {
      const pairsText = day.pairs.map((pair: Pair) => `${pair[0]} & ${pair[1]}`).join("\\n") + "\\n";
      return {
        start: day.date,
        end: day.date,
        summary: "Pairing pairs",
        description: [pairsText, description].join("\\n").replace(/(\r\n|\n|\r)/gm, "\\n"),
        recurring_interval: repeatEveryNWeeks,
        until_date: untilDate,
      } as CalendarEvent;
    });

    const test = createEvents(events);

    const data = new File([test], "calendar.ics", { type: "text/plain" });

    console.log(test);

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (fileUrl !== null) {
      window.URL.revokeObjectURL(fileUrl);
    }

    setFileUrl(window.URL.createObjectURL(data));
  };

  const onCreateFile = () => {
    makeIcsFile(days);
    setShowDownloadButton(true);
  };

  const hideDownloadButton = () => {
    setShowDownloadButton(false);
  };

  return (
    <div className="flex flex-row space-x-4 mb-2">
      <button
        onClick={onCreateFile}
        className="create-calendar bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
      >
        Create ics file
      </button>
      {showDownloadButton && (
        <>
          <a
            onClick={hideDownloadButton}
            id="Download"
            href={fileUrl}
            download="pairing-calendar.ics"
            className="download-calendar bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 border bg-green-700 rounded"
          >
            Download
          </a>
          <a className="download-calendar bg-transparent hover:underline text-blue-500 font-bold py-2 px-4" target="_blank" rel="noreferrer" href="https://support.google.com/calendar/answer/37118?hl=en&co=GENIE.Platform%3DDesktop#zippy=%2Ccreate-or-edit-an-icalendar-file">
            See how to import the file 
          </a>
        </>
      )}
    </div>
  );
};

export default CalendarFile;
