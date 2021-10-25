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

  const neededRepetitions = leastCommonMultiple(differentPairs * rotationFrequency, 5) / (differentPairs * rotationFrequency);
  const daysUntilDate: Rotations[] = _.range(neededRepetitions).map((value) => daysWithRepetition).flat(); 
  
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
    <div>
      <table>
        <thead>
          <tr>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      <div>
        Iterations needed for {Math.ceil(differentPairs / 2)} different pairs rotating every{" "}
        {rotationFrequency} day(s) in 5 days week is{" "}
        {leastCommonMultiple(differentPairs * rotationFrequency, 5)}
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
    <td key={coordinates} className={colorClass}>
      {date.toLocaleString("es-US", { month: "long", day: "numeric" })}
      {listItems}
    </td>
  );
};

export default MatrixTable;
