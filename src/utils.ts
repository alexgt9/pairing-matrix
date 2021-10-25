import _ from "lodash";

export const newParticipants = (participants: string[], iteration: number = 1) => {
    return [
      ...participants.slice(iteration),
      ...participants.slice(0, iteration),
    ];
  };
  
  export const padParisToBeEven = (names: string[]) => names.length % 2 === 0 ? names : names.concat(["🦆🦆🦆"]);
  
  export const leastCommonMultiple = (first: number, second: number) => {
    const first_list = _.range(1, 20).map(value => value * first);
    const second_list = _.range(1, 20).map(value => value * second);
    
    return first_list.filter((value) => second_list.includes(value))[0];
  };

type Pair = [string, string]

export const robin =  (participants: string[]) => {
  const DUMMY = "🦆🦆🦆";
  const rounds : Pair[][] = [];

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