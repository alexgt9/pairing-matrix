import MatrixTable from "./MatrixTable";
import { Pair } from "./types";
import { robin } from "./utils";

export interface Rotations {
  pairs: Pair[];
  colorClass: string;
};

export interface PairingDay {
  pairs: Pair[];
  colorClass: string;
  date: Date;
};

export interface MatrixProps {
  names: string[];
  rotationFrequency: number;
  description: string;
  untilDate?: Date;
};

const Matrix = ({ names, rotationFrequency, description, untilDate }: MatrixProps) => {
  let pairClassesCount = 0;
  const pairColorClasses: Record<string, string> = {};

  const pairColorClass = (pairs: Pair[]) => {
    const hash = pairs.reduce(
      (previous, pair): string => previous + pair[0] + pair[1],
      ""
    );
    const pairColor = pairColorClasses[hash] || `pair-${pairClassesCount % 10}`;
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
    <MatrixTable
      rotationDays={rotationDays}
      rotationFrequency={rotationFrequency}
      description={description}
      untilDate={untilDate}
    />
  );
};

export default Matrix;
