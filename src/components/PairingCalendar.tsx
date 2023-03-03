import CalendarFile from "./CalendarFile";
import CalendarFooter from "./CalendarFooter";
import CalendarTable from "./CalendarTable";
import ConwaysLawAlert from "./ConwaysLawAlert";
import { PairingDay, Rotations } from "./PairingApp";
import { getNextWorkingDay, leastCommonMultiple, nextMonday } from "../services/utils";

const DAYS_A_WEEK = 5;
const DEFAULT_ROTATION_FREQUENCY = 1;

export interface PairingCalendarProps {
  rotationDays: Rotations[];
  rotationFrequency: number;
  description: string;
  untilDate?: Date;
}

const PairingCalendar = ({
  rotationDays,
  rotationFrequency,
  description,
  untilDate,
}: PairingCalendarProps) => {
  const differentPairs = rotationDays.length;
  const daysPerSingleCycle = differentPairs * rotationFrequency;
  const timesToCompleteFullCycle =
    leastCommonMultiple(daysPerSingleCycle, DAYS_A_WEEK) / daysPerSingleCycle;

  const daysWithRotationFrequency: Rotations[] = rotationDays.reduce(
    (repeatedDays, day) => [
      ...repeatedDays,
      ...Array(rotationFrequency || DEFAULT_ROTATION_FREQUENCY).fill(day),
    ],
    [] as Rotations[]
  );
  const daysUntilCompleteFullCycle: Rotations[] = Array(
    timesToCompleteFullCycle || 1
  )
    .fill(daysWithRotationFrequency)
    .flat();

  const repeatEveryWeeks =
    leastCommonMultiple(daysPerSingleCycle, DAYS_A_WEEK) / DAYS_A_WEEK;

  let nextDay = nextMonday();
  const daysWithDate = daysUntilCompleteFullCycle.map((day) => {
    const dayWithDate = {
      ...day,
      date: nextDay,
    } as PairingDay;
    nextDay = getNextWorkingDay(nextDay);

    return dayWithDate;
  });
  const daysFilteredByEndDate = untilDate ? 
    daysWithDate.filter((day: PairingDay) => day.date < untilDate) :
    daysWithDate
  ;

  return !timesToCompleteFullCycle ? 
    <ConwaysLawAlert/> : 
    <>
      <CalendarFile
        days={daysFilteredByEndDate}
        repeatEveryNWeeks={repeatEveryWeeks}
        description={description}
        untilDate={untilDate}
      />
      <div className="flex flex-col">
        <CalendarTable days={daysFilteredByEndDate} />
        <CalendarFooter
          days={daysFilteredByEndDate}
          differentPairs={differentPairs}
          recurringInterval={repeatEveryWeeks}
          untilDate={untilDate}
        />
      </div>
    </>
  ;
};

export default PairingCalendar;
