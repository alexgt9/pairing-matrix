import { useState } from "react";
import MatrixTable from "./MatrixTable";
import { leastCommonMultiple, robin } from "./utils";

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

  const onChangeRotationFrequency = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRotationFrequency(event.target.value);
  };

  let pairClassesCount = 1;
  const pairColorClasses: Record<string, string> = {};

  const pairColorClass = (pairs: Pair[]) => {
    const hash = pairs.reduce(
      (previous, pair): string => previous + pair[0] + pair[1],
      ""
    );
    const pairColor = pairColorClasses[hash] || `pair-${pairClassesCount % 9}`;
    pairClassesCount += 1;
    pairColorClasses[hash] = pairColor;

    return pairColor;
  };

  const rotationDays: RotationDay[] = robin(names).map((pairs: Pair[]) => {
    return {
      pairs,
      colorClass: pairColorClass(pairs),
    } as RotationDay;
  });
  const differentPairs = rotationDays.length;

  return (
    <div>
      <div>
        Pairing every{" "}
        <input value={rotationFrequency} onChange={onChangeRotationFrequency} />{" "}
        days
      </div>
      <div>
        <MatrixTable
          rotationDays={rotationDays}
          rotationFrequency={parseInt(rotationFrequency)}
        />
      </div>
      <div>
        Iterations needed for {differentPairs} different pairs rotating every{" "}
        {rotationFrequency} day(s) in 5 days week is{" "}
        {leastCommonMultiple(differentPairs * parseInt(rotationFrequency), 5)}
      </div>
    </div>
  );
};

export default Matrix;
