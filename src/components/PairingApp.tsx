import PairingCalendar from "./PairingCalendar";
import { Pair } from "../types";
import { robin } from "../services/utils";

export interface Rotations {
  pairs: Pair[];
  colorClass: string;
};

export interface PairingDay {
  pairs: Pair[];
  colorClass: string;
  date: Date;
};

export interface PairingAppProps {
  names: string[];
  rotationFrequency: number;
  description: string;
  untilDate?: Date;
};

const PairingApp = ({ names, rotationFrequency, description, untilDate }: PairingAppProps) => {
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
    <PairingCalendar
      rotationDays={rotationDays}
      rotationFrequency={rotationFrequency}
      description={description}
      untilDate={untilDate}
    />
  );
};

export default PairingApp;
