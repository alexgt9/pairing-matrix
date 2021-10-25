import { useState } from "react";
import MatrixTable from "./MatrixTable";
import { robin } from "./utils";

type MatrixProps = {
  names: string[];
};

export type Pair = [string, string];
type Rotations = {
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

  const rotationDays: Rotations[] = robin(names).map((pairs: Pair[]) => {
    return {
      pairs,
      colorClass: pairColorClass(pairs),
    } as Rotations;
  });

  return (
    <div>
      <div>
        Pairing every{" "}
        <input value={rotationFrequency} onChange={onChangeRotationFrequency} />{" "}
        days
      </div>
      <MatrixTable
        rotationDays={rotationDays}
        rotationFrequency={parseInt(rotationFrequency)}
      />
    </div>
  );
};

export default Matrix;
