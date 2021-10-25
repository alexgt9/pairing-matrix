import _ from "lodash";

type MatrixTableProps = {
  rotationDays: RotationDay[];
  rotationFrequency: number;
};

type Pair = [string, string];
type RotationDay = {
  pairs: Pair[];
  colorClass: string;
};

const MatrixTable = ({ rotationDays, rotationFrequency }: MatrixTableProps) => {
  const daysWithRepetition: RotationDay[] = rotationDays.reduce(
    (repeatedDays, day) => [
      ...repeatedDays,
      ...Array(rotationFrequency || 1).fill(day),
    ],
    [] as RotationDay[]
  );

  const rows = _.chunk(daysWithRepetition, 5).map((week, index) => (
    <TableRow key={index} rowNumber={index} days={week} />
  ));

  return (
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
  );
};

type TableRowProps = {
  rowNumber: number;
  days: RotationDay[];
};

export const TableRow = ({ days, rowNumber }: TableRowProps) => {
  const cells = days.map((day: RotationDay, index: number) => (
    <TableCell key={index} pairs={day.pairs} colorClass={day.colorClass} coordinates={`${rowNumber}-${index}`}/>
  ));

  return <tr key={rowNumber}>{cells}</tr>;
};

type TableCellProps = {
  coordinates: string;
  pairs: Pair[];
  colorClass: string;
};

export const TableCell = ({ pairs, colorClass, coordinates }: TableCellProps) => {
  const listItems = pairs.map((pair: Pair, index: number) => (
    <li key={`${pair[0]}${pair[1]}`}>{`${pair[0]} & ${pair[1]}`}</li>
  ));

  return <td key={coordinates} className={colorClass}>{listItems}</td>;
};

export default MatrixTable;
