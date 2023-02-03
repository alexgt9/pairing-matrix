import React, { useState } from "react";

export type PairingRoomProps = {
  roomName: string;
  names: string[];
  link?: string;
  startDraging: (name: string) => void;
  finishDraging: (roomName: string) => void;
};

export default ({
  roomName,
  names,
  link,
  startDraging,
  finishDraging,
}: PairingRoomProps) => {
  const [dragOver, setDragOver] = useState<boolean>(false);
  const activeClass = dragOver ? "border-yellow-400" : "";

  const onDragStartName = (event: React.DragEvent<HTMLDivElement>) => {
    startDraging(event.currentTarget.innerText);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);

    const room = event.currentTarget.dataset.room;
    room && finishDraging(room);
  };

  const onDragOverRoom = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const onDragLeaveRoom = (event: React.DragEvent<HTMLDivElement>) => {
    setDragOver(false);
  };

  return (
    <div
      className={`flex border-2 w-max m-4 p-4 ${activeClass}`}
      data-room={roomName}
      onDragOver={onDragOverRoom}
      onDragEnter={onDragOverRoom}
      onDragLeave={onDragLeaveRoom}
      onDrop={onDrop}
    >
      <span className="self-center font-extrabold mr-2">{roomName}</span>
      {names.map((name) => {
        return (
          <div
            key={name}
            className="shadow border-1 p-3 m-2 rounded-lg bg-blue-100 font-bold"
            onDragStart={onDragStartName}
            draggable
          >
            {name}
          </div>
        );
      })}
      {link && (
        <span className="font-bold self-center">
          Link:{" "}
          <a className="text-blue-600" href="{link}">
            {link}
          </a>
        </span>
      )}
    </div>
  );
};
