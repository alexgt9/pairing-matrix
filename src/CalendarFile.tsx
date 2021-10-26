import { useState } from "react";
import { createEvents } from "./CalenadarGenerator";
import { Pair } from "./Matrix";
import { PairingDay } from "./MatrixTable";

interface CalendarFileProps {
  days: PairingDay[];
}

const CalendarFile = ({ days }: CalendarFileProps) => {
  const [fileUrl, setFileUrl] = useState("");

  const makeIcsFile = (
    start: Date,
    end: Date,
    summary: string,
    description: string
  ) => {
    const test = createEvents([
      { start, end, summary, description, recurring_interval: 2 },
    ]);

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
    const first = days[0];
    makeIcsFile(
      first.date,
      first.date,
      "Pairing pairs",
      first.pairs.map((pair: Pair) => `${pair[0]} & ${pair[1]}`).join("\\n") + "\\n" + "https://thoughtworks.zoom.us/j/7163705558"
    );
  };

  return (
    <div className="flex flex-row space-x-4">
      <button
        onClick={onCreateFile}
        className="create-calendar bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
      >
        Create
      </button>
      {fileUrl && (
        <a
          id="Download"
          href={fileUrl}
          download="pairing-calendar.ics"
          className="download-calendar bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
        >
          Download
        </a>
      )}
    </div>
  );
};

export default CalendarFile;
