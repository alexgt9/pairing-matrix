import _ from "lodash";

type MatrixTableProps = {
  rotationDays: RotationDay[];
  rotationFrequency: number;
};

type Pair = [string, string];
type RotationDay = {
  pairs: Pair[];
};

const MatrixTable = ({ rotationDays, rotationFrequency }: MatrixTableProps) => {
  const daysWithRepetition: RotationDay[] = rotationDays.reduce(
    (repeatedDays, day) => [...repeatedDays, ...Array(rotationFrequency || 1).fill(day)], 
    [] as RotationDay[]
  );

  const rows = _.chunk(daysWithRepetition, 5).map((week) => <TableRow days={week}/>)

  return (
    <table>
      <thead>
        <th>Monday</th>
        <th>Tuesday</th>
        <th>Wednesday</th>
        <th>Thursday</th>
        <th>Friday</th>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
};

type TableRowProps = {
  days: RotationDay[];
};

export const TableRow = ({ days }: TableRowProps) => {
  const cells = days.map((day: RotationDay, index: number) => (
    <TableCell pairs={day.pairs} />
  ));

  return (
    <tr>
      {cells}
    </tr>
  );
};

type TableCellProps = {
  pairs: Pair[];
};

export const TableCell = ({ pairs }: TableCellProps) => {
  const listItems = pairs.map((pair: Pair, index: number) => (
    <li key={`${pair[0]}${pair[1]}`}>{`${pair[0]} & ${pair[1]}`}</li>
  ));

  return (
    <td>
      {listItems}
    </td>
  );
};

export default MatrixTable;
