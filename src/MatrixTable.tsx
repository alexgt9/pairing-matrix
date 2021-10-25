import _ from "lodash";
import { getNextWorkingDay, leastCommonMultiple, nextMonday } from "./utils";

type MatrixTableProps = {
  rotationDays: Rotations[];
  rotationFrequency: number;
};

type Pair = [string, string];
type Rotations = {
  pairs: Pair[];
  colorClass: string;
};

type PairingDay = {
  pairs: Pair[];
  colorClass: string;
  date: Date;
};

const MatrixTable = ({ rotationDays, rotationFrequency }: MatrixTableProps) => {
  const differentPairs = rotationDays.length;

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

  const rows = _.chunk(daysWithDate, 5).map((week, index) => (
    <TableRow key={index} rowNumber={index} days={week} />
  ));

  return (
    <div className={"matrix"}>
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
          <tbody className="bg-white divide-x divide-y divide-gray-200">{rows}</tbody>
        </table>
      </div>
      <div>
        <ul className={"summary-list"}>
          <li>Rotation frequency: {rotationFrequency} day(s)</li>
          <li>Different pairs: {Math.ceil(differentPairs / 2)}</li>
          <li>The cycle is every {repeatEveryWeeks} week(s)</li>
        </ul>
      </div>
    </div>
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

  return (
    <td className="px-6 py-4 whitespace-nowrap border-gray-400" key={coordinates}>
      <span className={"cell-date"}>
        {date.toLocaleString("es-US", { month: "long", day: "numeric" })}
      </span>
      <div className={`${colorClass} pair`}>{listItems}</div>
    </td>
  );
};

export default MatrixTable;
