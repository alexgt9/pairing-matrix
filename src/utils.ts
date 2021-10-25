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