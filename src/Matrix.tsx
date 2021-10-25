import _ from "lodash";
import { useState } from "react";
import MatrixTable from "./MatrixTable";
import { leastCommonMultiple, newParticipants, padParisToBeEven, robin } from "./utils";

type MatrixProps = {
  names: string[];
};

export type Pair = [string, string];
type RotationDay = {
  pairs: Pair[];
  colorClass: string; 
};

const Matrix = ({ names }: MatrixProps) => {
  const [rotationFrequency, setRotationFrequency] = useState("1");

  const onChangeRotationFrequency = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRotationFrequency(event.target.value);
  }

  let pairClassesCount = 1;
  const pairColorClasses : Record<string, string> = {};

  const pairColorClass = (pairs: Pair[]) => {
    const hash = pairs.reduce((previous, pair) : string => previous+pair[0]+pair[1], "")
    const pairColor = pairColorClasses[hash] || `pair-${pairClassesCount}`;
    pairClassesCount += 1;
    pairColorClasses[hash] = pairColor;

    return pairColor;
  };

  const participants = padParisToBeEven(names);
  const differentPairs = participants.length - 1;
  const rotationDays : RotationDay[] = _.range(differentPairs).map((index) => {
    const pairs = _.chunk(newParticipants(participants, index), 2) as Pair[];

    return {
      pairs,
      colorClass: pairColorClass(pairs)
    } as RotationDay;
  });

  const iterations = rotationDays.map((day, index) => {
    return <Iteration key={index} day={index + 1} pairs={day.pairs} />;
  });

  return <div>
    <div>Pairing every <input value={rotationFrequency} onChange={onChangeRotationFrequency}/> days</div>
    <div><MatrixTable rotationDays={rotationDays} rotationFrequency={parseInt(rotationFrequency)} /></div>
    <div>{iterations}</div>
    <div>Iterations needed for {differentPairs} different pairs rotatin every {rotationFrequency} day(s) in 5 days week is {leastCommonMultiple(differentPairs * parseInt(rotationFrequency), 5)}</div>
  </div>;
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
      <h2>{`Pairs ${day}`}</h2>
      <ul>{listItems}</ul>
    </div>
  );
};

export default Matrix;
