import React, { KeyboardEvent, useState } from "react";
import PairingRoom from "../components/PairingRoom";

const splitIntoChunks = (names: string[], chunkSize: number): string[][] => {
  const result = [];
  for (let i = 0; i < names.length; i += chunkSize) {
    const chunk = names.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
};

export default () => {
  const [newName, setNewName] = useState<string>("");
  const [names, setNames] = useState<string[]>([
    "Paco",
    "Alejandro",
    "Elna",
    "Laura",
  ]);
  const [error, setError] = useState<boolean>(false);
  const [movingPerson, setMovingPerson] = useState<string | undefined>();
  const [intoRoom, setIntoRoom] = useState<string | undefined>();

  const rooms = splitIntoChunks(names, 2);

  const onNewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.currentTarget.value);
    setError(false);
  };

  const onKeydownNewName = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newName) {
      if (names.includes(newName)) {
        setError(true);

        return;
      }

      setNames((oldNames) => [...oldNames, newName]);
      setNewName("");
      setError(false);
    }
  };

  const onStartDraging = (name: string) => {
    setMovingPerson(name);
  };

  const onFinishDraging = (room: string) => {
    setIntoRoom(room);
    console.log(`Moving person ${movingPerson} into room ${room}`);
  };

  return (
    <>
      <section className="flex flex-col m-4">
        <header className="text-lg font-extrabold self-start">
          Participants
        </header>
        <div className="flex border-2 w-max mt-4">
          {names.map((item) => (
            <div
              className="shadow border-1 p-3 m-2 rounded-lg bg-blue-100 font-bold"
              key={item}
            >
              {item}
            </div>
          ))}
          <input
            onKeyDown={onKeydownNewName}
            className="shadow border-1 p-3 m-2 rounded-lg bg-blue-100 font-bold"
            type="text"
            placeholder="Add participant"
            value={newName}
            onChange={onNewNameChange}
          />
        </div>
        {error && (
          <div className="self-start text-red-400 font-semibold">
            This name <span className="font-bold text-red-700">{newName}</span>{" "}
            is already in the list
          </div>
        )}
      </section>
      <section className="ml-4">
        <header className="text-lg font-extrabold self-start">Rooms</header>
        {rooms.map((roomNames, key) => (
          <PairingRoom
            key={key}
            roomName={`Room ${key + 1}`}
            names={roomNames}
            link={`http://zoom.com/room${key + 1}`}
            startDraging={onStartDraging}
            finishDraging={onFinishDraging}
          />
        ))}
      </section>
    </>
  );
};
