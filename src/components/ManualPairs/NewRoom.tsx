import { useState } from "react";
import { Room } from "../../model/Storage";
import Dropable from "./Dropable";

export interface NewRoomProps {
  onDropCb: (newRoomName: string) => void;
  rooms: Room[];
  onNewRoom: (newRoom: string) => void;
}

const generateNewUniqueRoomName = (rooms: Room[]) : string => {
  let newId = rooms.length;
  while(existRoomWithName(rooms, `Room ${newId}`)) {
    newId++;
  }

  return `Room ${newId}`;
};

const existRoomWithName = (rooms: Room[], name: string) : boolean => {
  return rooms.some((room) => room.name === name);
};

export default function ({ onDropCb, rooms, onNewRoom }: NewRoomProps) {
  const [newRoom, setNewRoom] = useState<string>("");
  const [errorRoom, setErrorRoom] = useState<boolean>(false);

  const onKeydownNewRoom = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newRoom) {
      if (existRoomWithName(rooms, newRoom)) {
        setErrorRoom(true);

        return;
      }

      onNewRoom(newRoom);
      setNewRoom("");
      setErrorRoom(false);
    }
  };

  const onNewRoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoom(event.currentTarget.value);
    setErrorRoom(false);
  };

  const onDrop = () => {
    onDropCb(generateNewUniqueRoomName(rooms));
  };

  return (
    <>
      <Dropable onDrop={onDrop} styles="w-full">
        <input
          type={"text"}
          className={`self-center p-4 dark:bg-gray-200 outline-gray-400 w-full`}
          placeholder="Drag someone here or write room name to create a new room"
          onKeyDown={onKeydownNewRoom}
          onChange={onNewRoomChange}
          value={newRoom}
        />
      </Dropable>
      {errorRoom && (
        <div className="p-2 self-start text-red-400 font-semibold">
          <span className="font-bold text-red-700">{newRoom}</span> already
          exists
        </div>
      )}
    </>
  );
}
