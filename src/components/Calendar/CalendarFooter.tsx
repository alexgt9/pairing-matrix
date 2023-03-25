import _ from "lodash";
import { PairingDay } from "./PairingApp";

export interface CalendarFooterProps {
  days: PairingDay[];
  differentPairs: number;
  recurringInterval: number;
  untilDate?: Date;
};

const CalendarFooter = ({ days, differentPairs, recurringInterval, untilDate }: CalendarFooterProps) => {
  return ( 
    <div>
    <ul className={"flex flex-col"}>
      <li className="m-2">Different pairs: {differentPairs} (marked by the different colors) 
        {_.range(differentPairs).map((index: number) => <span key={index} className={`border-4 rounded-md border-dashed pair-${index % 10} mx-1 p-1`}>{index + 1}</span>)}
      </li>
      <li className="m-2">The complete cycle is every {recurringInterval} week(s)</li>
      <li className="m-2">This will create {days.length} different events in your calendar that are recurring every {recurringInterval} week(s)</li>
      { untilDate &&  <li className="m-2">Recurrence will end at {untilDate.toLocaleString("en-US", { month: "long", day: "numeric" })}</li>}
      <li role="alert">
        <p className="bg-orange-200 border-l-4 border-orange-500 text-orange-700 p-4">Events has an UID associated (can be seen in the event description) so importing events again will replace previous ocurrences of the events</p>
        </li>
    </ul>
  </div>
  );
};

export default CalendarFooter;
