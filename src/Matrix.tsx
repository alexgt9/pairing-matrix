import _ from "lodash";

type MatrixProps = {
  names: string[];
};

type Pair = [string, string];

const newParticipants = (participants: string[], iteration: number = 1) => {
  return [
    ...participants.slice(iteration),
    ...participants.slice(0, iteration),
  ];
};

const Matrix = ({ names }: MatrixProps) => {
  const participants =
    names.length % 2 === 0 ? names : names.concat(["🦆🦆🦆"]);

  const iterations = _.range(participants.length - 1).map((index) => {
    const pairs = _.chunk(newParticipants(participants, index), 2) as Pair[];
    return <Iteration key={index} pairs={pairs} />;
  });

  return <div>{iterations}</div>;
};

type IterationProps = {
  pairs: Pair[];
};

const Iteration = ({ pairs }: IterationProps) => {
  const listItems = pairs.map((pair: Pair, index: number) => (
    <li key={`${pair[0]}${pair[1]}`}>{`Room ${index}: ${pair[0]} & ${pair[1]}`}</li>
  ));

  return (
    <div>
      <ul>{listItems}</ul>
    </div>
  );
};

export default Matrix;
