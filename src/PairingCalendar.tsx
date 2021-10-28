import _ from "lodash";
import CalendarFile from "./CalendarFile";
import CalendarFooter from "./CalendarFooter";
import CalendarTable from "./CalendarTable";
import { PairingDay, Rotations } from "./PairingApp";
import { Pair } from "./types";
import { getNextWorkingDay, leastCommonMultiple, nextMonday } from "./utils";

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

  const daysWithRepetition: Rotations[] = rotationDays.reduce(
    (repeatedDays, day) => [
      ...repeatedDays,
      ...Array(rotationFrequency || DEFAULT_ROTATION_FREQUENCY).fill(day),
    ],
    [] as Rotations[]
  );

  const neededRepetitions =
    leastCommonMultiple(differentPairs * rotationFrequency, DAYS_A_WEEK) /
    (differentPairs * rotationFrequency);
  const daysUntilDate: Rotations[] = _.range(neededRepetitions)
    .map(() => daysWithRepetition)
    .flat();

  const repeatEveryWeeks =
    leastCommonMultiple(differentPairs * rotationFrequency, DAYS_A_WEEK) /
    DAYS_A_WEEK;

  let nextDay = nextMonday();
  const daysWithDate = daysUntilDate.map((day) => {
    const dayWithDate = {
      ...day,
      date: nextDay,
    } as PairingDay;
    nextDay = getNextWorkingDay(nextDay);

    return dayWithDate;
  });
  const daysFilteredByEndDate = daysWithDate.filter((day: PairingDay) =>
    untilDate ? day.date < untilDate : true
  );

  return !neededRepetitions ? (
    <div>
      <p className="alert-box bg-orange-200 border-l-4 border-orange-500 text-orange-700 p-4">
        The participants & rotation frequency numbers are so high that probably
        you don't want to know the results,
        <a
          className="underline ml-2"
          href="https://en.wikipedia.org/wiki/Conway%27s_law"
          target="_blank"
          rel="noreferrer"
        >
          check this out
        </a>
      </p>
    </div>
  ) : (
    <>
      <CalendarFile
        days={daysFilteredByEndDate}
        repeatEveryNWeeks={repeatEveryWeeks}
        description={description}
        untilDate={untilDate}
      />
      <div className="space-y-4 flex flex-col">
        <CalendarTable days={daysFilteredByEndDate} />
        <CalendarFooter
          days={daysFilteredByEndDate}
          differentPairs={differentPairs}
          recurringInterval={repeatEveryWeeks}
          untilDate={untilDate}
        />
      </div>
    </>
  );
};

type TableRowProps = {
  rowNumber: number;
  days: PairingDay[];
};

export const TableRow = ({ days, rowNumber }: TableRowProps) => {
  const cells = days.map((day: PairingDay, index: number) => (
    <TableCell
      key={index}
      pairs={day.pairs}
      colorClass={day.colorClass}
      coordinates={`${rowNumber}-${index}`}
      date={day.date}
    />
  ));

  return <tr key={rowNumber}>{cells}</tr>;
};

type TableCellProps = {
  date: Date;
  coordinates: string;
  pairs: Pair[];
  colorClass: string;
};

export const TableCell = ({
  pairs,
  colorClass,
  coordinates,
  date,
}: TableCellProps) => {
  const listItems = pairs.map((pair: Pair, index: number) => (
    <li key={`${pair[0]}${pair[1]}`}>{`${pair[0]} & ${pair[1]}`}</li>
  ));
  const monthStyle =
    coordinates === "0-0" || date.getDate() === 1 ? "long" : "short";

  return (
    <td
      className="px-6 py-4 whitespace-nowrap border-gray-400"
      key={coordinates}
    >
      <span className={"cell-date"}>
        {date.toLocaleString("es-US", { month: monthStyle, day: "numeric" })}
      </span>
      <div className={`${colorClass} pair rounded-md`}>{listItems}</div>
    </td>
  );
};

export default PairingCalendar;
