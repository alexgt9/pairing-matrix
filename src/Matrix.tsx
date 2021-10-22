import _ from "lodash";
import { useState } from "react";

type MatrixProps = {
  names: string[];
};

type Pair = [string, string];

const newParticipants = (participants: string[], iteration: number = 1) => {
  return [
    ...participants.slice(iteration),
    ...participants.slice(0, iteration),
  ];
};

const padParisToBeEven = (names: string[]) => names.length % 2 === 0 ? names : names.concat(["🦆🦆🦆"]);

const leastCommonMultiple = (first: number, second: number) => {
  const first_list = _.range(1, 20).map(value => value * first);
  const second_list = _.range(1, 20).map(value => value * second);
  
  return first_list.filter((value) => second_list.includes(value))[0];
};

const Matrix = ({ names }: MatrixProps) => {
  const [rotationFrequency, setRotationFrequency] = useState("1");

  const onChangeRotationFrequency = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRotationFrequency(event.target.value);
  }

  const participants = padParisToBeEven(names);
  const differentPairs = participants.length - 1;

  const iterations = _.range(differentPairs).map((index) => {
    const pairs = _.chunk(newParticipants(participants, index), 2) as Pair[];
    return <Iteration key={index} day={index + 1} pairs={pairs} />;
  });

  const iterationsTable = _.range(differentPairs).map((index) => {
    const pairs = _.chunk(newParticipants(participants, index), 2) as Pair[];
    return <TableCell key={index} pairs={pairs} />;
  });


  return <div>
    <div>Pairing every <input value={rotationFrequency} onChange={onChangeRotationFrequency}/> days</div>
    <div>{iterations}</div>
    <div>Iterations needed for {differentPairs} different pairs rotatin every {rotationFrequency} day(s) in 5 days week is {leastCommonMultiple(differentPairs * parseInt(rotationFrequency), 5)}</div>
    <div><MatrixTable participants={participants} rotationFrequency={parseInt(rotationFrequency)} /></div>
  </div>;
};

type MatrixTableProps = {
  participants: string[];
  rotationFrequency: number;
};

type RotationDay = {
  pairs: Pair[];
};

const MatrixTable = ({ participants, rotationFrequency }: MatrixTableProps) => {
  const differentPairs = participants.length - 1;

  const rotationDays : RotationDay[] = _.range(differentPairs).map((index) => {
    return { pairs: _.chunk(newParticipants(participants, index), 2) as Pair[]} as RotationDay;
  });

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

const TableRow = ({ days }: TableRowProps) => {
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

const TableCell = ({ pairs }: TableCellProps) => {
  const listItems = pairs.map((pair: Pair, index: number) => (
    <li key={`${pair[0]}${pair[1]}`}>{`Room ${index + 1}: ${pair[0]} & ${pair[1]}`}</li>
  ));

  return (
    <td>
      {listItems}
    </td>
  );
};

type IterationProps = {
  day: number;
  pairs: Pair[];
};

const Iteration = ({ pairs, day }: IterationProps) => {
  const listItems = pairs.map((pair: Pair, index: number) => (
    <li key={`${pair[0]}${pair[1]}`}>{`Room ${index + 1}: ${pair[0]} & ${pair[1]}`}</li>
  ));

  return (
    <div>
      <h2>{`Day ${day}`}</h2>
      <ul>{listItems}</ul>
    </div>
  );
};

export default Matrix;
