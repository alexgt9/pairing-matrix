import _ from "lodash";
import { useState } from "react";
import { PairingDay } from "./PairingApp";
import { Pair } from "./types";

const TWO_MONTHS = 8;
const INFINITE = 1000;
const DAYS_A_WEEK = 5;

export interface CalendarTableProps {
  days: PairingDay[];
}

const CalendarTable = ({ days }: CalendarTableProps) => {
  const [maxWeeksToShow, setMaxWeeksToShow] = useState(TWO_MONTHS);

  const daysByWeek = _.chunk(days, DAYS_A_WEEK);
  const weeks = daysByWeek.length;
  const rows = daysByWeek
    .slice(0, maxWeeksToShow)
    .map((week, index) => (
      <TableRow key={index} rowNumber={index} days={week} />
    ));

  const onShowMoreWeeksClick = () => setMaxWeeksToShow(INFINITE);

  return (
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
          {weeks > maxWeeksToShow && (
            <tr>
              <td
                colSpan={5}
                className="p-2 bg-orange-100 border-b-1 border-orange-400 text-orange-700"
              >
                <span
                  onClick={onShowMoreWeeksClick}
                  className="p-2 bg-orange-100 border-b-1 border-orange-400 text-orange-700 hover:text-orange-900 hover:underline cursor-pointer"
                >{`${weeks} more weeks... (show more)`}</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

interface TableRowProps {
  rowNumber: number;
  days: PairingDay[];
}

const TableRow = ({ days, rowNumber }: TableRowProps) => {
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

interface TableCellProps {
  date: Date;
  coordinates: string;
  pairs: Pair[];
  colorClass: string;
}

const TableCell = ({
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
      className="px-6 py-2 whitespace-nowrap border-gray-400"
      key={coordinates}
    >
      <span className={"font-bold"}>
        {date.toLocaleString("en-US", { month: monthStyle, day: "numeric" })}
      </span>
      <div className={`${colorClass} py-2 border-4 border-dashed rounded-md mt-2`}>{listItems}</div>
    </td>
  );
};

export default CalendarTable;
