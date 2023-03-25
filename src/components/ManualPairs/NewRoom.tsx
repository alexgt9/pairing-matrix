import { useState } from "react";
import { Room } from "../../model/Storage";
import Dropable from "./Dropable";

export interface NewRoomProps {
  onDrop: () => void;
  rooms: Room[];
  onNewRoom: (newRoom: string) => void;
}

export default function ({ onDrop, rooms, onNewRoom }: NewRoomProps) {
  const [newRoom, setNewRoom] = useState<string>("");
  const [errorRoom, setErrorRoom] = useState<boolean>(false);

  const onKeydownNewRoom = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newRoom) {
      if (rooms.some((room) => room.name === newRoom)) {
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

  return (
    <>
      <Dropable onDrop={onDrop} styles="w-full">
        <input
          type={"text"}
          className={`self-center p-4 dark:bg-gray-200 outline-gray-400 w-full`}
          placeholder="Drag or click to add new room"
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
