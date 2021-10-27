import _ from "lodash";
import { useState } from "react";
import CalendarFile from "./CalendarFile";
import { getNextWorkingDay, leastCommonMultiple, nextMonday } from "./utils";

type MatrixTableProps = {
  rotationDays: Rotations[];
  rotationFrequency: number;
  description: string;
};

type Pair = [string, string];
type Rotations = {
  pairs: Pair[];
  colorClass: string;
};

export interface PairingDay {
  pairs: Pair[];
  colorClass: string;
  date: Date;
};

const TWO_MONTHS = 8;
const INFINITE = 1000;

const MatrixTable = ({ rotationDays, rotationFrequency, description }: MatrixTableProps) => {
  const differentPairs = rotationDays.length;

  const [maxWeeksToShow, setMaxWeeksToShow] = useState(TWO_MONTHS);

  const daysWithRepetition: Rotations[] = rotationDays.reduce(
    (repeatedDays, day) => [
      ...repeatedDays,
      ...Array(rotationFrequency || 1).fill(day),
    ],
    [] as Rotations[]
  );

  const neededRepetitions =
    leastCommonMultiple(differentPairs * rotationFrequency, 5) /
    (differentPairs * rotationFrequency);
  const repeatEveryWeeks =
    leastCommonMultiple(differentPairs * rotationFrequency, 5) / 5;
  const daysUntilDate: Rotations[] = _.range(neededRepetitions)
    .map((value) => daysWithRepetition)
    .flat();

  let nextDay = nextMonday();
  const daysWithDate = daysUntilDate.map((day) => {
    const dayWithDate = {
      ...day,
      date: nextDay,
    } as PairingDay;
    nextDay = getNextWorkingDay(nextDay);

    return dayWithDate;
  });

  const weeks = _.chunk(daysWithDate, 5).length;
  const rows = _.chunk(daysWithDate, 5).slice(0, maxWeeksToShow).map((week, index) => (
    <TableRow key={index} rowNumber={index} days={week} />
  ));

  const onShowMoreWeeksClick = () => setMaxWeeksToShow(INFINITE);

  return (!neededRepetitions ? 
      <div><p className="alert-box bg-orange-200 border-l-4 border-orange-500 text-orange-700 p-4">
        The participants & rotation frequency numbers are so high that probably you don't want to know the results,
        <a className="underline ml-2" href="https://en.wikipedia.org/wiki/Conway%27s_law" target="_blank" rel="noreferrer">check this out</a>
      </p></div> :
      <>
        <CalendarFile days={daysWithDate} repeatEveryNWeeks={repeatEveryWeeks} description={description}/>
        <div className="matrix space-y-4 flex flex-col">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monday
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tuesday
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wednesday
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thursday
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Friday
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-x divide-y divide-gray-200">
                {rows}
                {weeks > maxWeeksToShow && 
                  <tr><td onClick={onShowMoreWeeksClick} colSpan={5} className="p-2 bg-orange-100 border-b-1 border-orange-400 text-orange-700">
                    <span className="p-2 bg-orange-100 border-b-1 border-orange-400 text-orange-700 hover:text-orange-900 hover:underline cursor-pointer">{`${weeks} more weeks... (show more)`}</span>
                  </td></tr>}
              </tbody>
            </table>
          </div>
          <div>
            <ul className={"summary-list"}>
              <li className="m-2">Different pairs: {differentPairs} (marked by the different colors) 
                {_.range(differentPairs).map((index: number) => <span key={index} className={`border-4 rounded-md border-dashed pair-${index % 10} mx-1 p-1`}>{index + 1}</span>)}
              </li>
              <li className="m-2">The complete cycle is every {repeatEveryWeeks} week(s)</li>
              <li className="m-2">This will create {daysWithDate.length} different events in your calendar thar are recurring every {repeatEveryWeeks} week(s)</li>
              <li role="alert">
                <p className="alert-box bg-orange-200 border-l-4 border-orange-500 text-orange-700 p-4">Events has an UID associated (can be seen in the event description) so importing events again will replace previous ocurrences of the events</p>
                </li>
            </ul>
          </div>
        </div>
      </>
  );
};

type TableRowProps = {
  rowNumber: number;
  days: PairingDay[];
};

export const TableRow = ({ days, rowNumber }: TableRowProps) => {
  const cells = days.map((day: PairingDay, index: number) => (
    <TableCell
      key={index}
      pairs={day.pairs}
      colorClass={day.colorClass}
      coordinates={`${rowNumber}-${index}`}
      date={day.date}
    />
  ));

  return <tr key={rowNumber}>{cells}</tr>;
};

type TableCellProps = {
  date: Date;
  coordinates: string;
  pairs: Pair[];
  colorClass: string;
};

export const TableCell = ({
  pairs,
  colorClass,
  coordinates,
  date,
}: TableCellProps) => {
  const listItems = pairs.map((pair: Pair, index: number) => (
    <li key={`${pair[0]}${pair[1]}`}>{`${pair[0]} & ${pair[1]}`}</li>
  ));
  const monthStyle =
    coordinates === "0-0" || date.getDate() === 1 ? "long" : "short";

  return (
    <td
      className="px-6 py-4 whitespace-nowrap border-gray-400"
      key={coordinates}
    >
      <span className={"cell-date"}>
        {date.toLocaleString("es-US", { month: monthStyle, day: "numeric" })}
      </span>
      <div className={`${colorClass} pair rounded-md`}>{listItems}</div>
    </td>
  );
};

export default MatrixTable;
