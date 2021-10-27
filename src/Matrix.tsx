import MatrixTable from "./MatrixTable";
import { robin } from "./utils";

type MatrixProps = {
  names: string[];
  rotationFrequency: number;
  description: string;
};

export type Pair = [string, string];
type Rotations = {
  pairs: Pair[];
  colorClass: string;
};

const Matrix = ({ names, rotationFrequency, description }: MatrixProps) => {
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
    />
  );
};

export default Matrix;
