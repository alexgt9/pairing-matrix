import _ from "lodash";

export const leastCommonMultiple = (first: number, second: number) => {
  const first_list = _.range(1, 1000).map((value) => value * first);
  const second_list = _.range(1, 1000).map((value) => value * second);

  return first_list.filter((value) => second_list.includes(value))[0];
};

type Pair = [string, string];

export const robin = (participants: string[]) => {
  const DUMMY = "🦆🦆🦆";
  const rounds: Pair[][] = [];

  if (participants.length % 2 === 1) {
    participants.push(DUMMY); // so we can match algorithm for even numbers
  }

  const participantsCount = participants.length;
  for (let j = 0; j < participantsCount - 1; j += 1) {
    rounds[j] = [] as Pair[]; // create inner pairs array for round j
    for (let i = 0; i < participantsCount / 2; i += 1) {
      const o = participantsCount - 1 - i;
      rounds[j].push([participants[i], participants[o]] as Pair);
    }
    participants.splice(1, 0, participants.pop() || ""); // permutate for next round
  }
  return rounds;
};

const SATURDAY = 6;
const SUNDAY = 0;
export const getNextWorkingDay = (date: Date): Date => {
    let nextWorkingDay = addDay(date);
    if (
        nextWorkingDay.getDay() !== SATURDAY &&
        nextWorkingDay.getDay() !== SUNDAY
    ) {
        return nextWorkingDay;
    }

    return getNextWorkingDay(nextWorkingDay);
};

const addDay = (date: Date) => {
const newDate = new Date(date.valueOf());
newDate.setDate(date.getDate() + 1);

return newDate;
};

export const nextMonday = () => {
    const today = new Date();
    today.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7));

    return today;
};