import React, { useState } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

export type PairingRoomProps = {
  id: number;
  roomName: string;
  names: string[];
  link?: string;
  startDraging: (name: string) => void;
  finishDraging: (roomName: number) => void;
  nameChanged: (id: number, newName: string) => void;
  linkChanged: (id: number, newLink: string) => void;
  selectedPerson: string;
};

export default ({
  id,
  roomName,
  names,
  link,
  startDraging,
  finishDraging,
  nameChanged,
  linkChanged,
  selectedPerson,
}: PairingRoomProps) => {
  const [dragOver, setDragOver] = useState<boolean>(false);
  const activeClass = dragOver ? "border-yellow-400 dark:border-yellow-400" : "";

  const onDragStartName = (event: React.DragEvent<HTMLDivElement>) => {
    startDraging(event.currentTarget.innerText);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);

    const roomId = event.currentTarget.dataset.roomId;
    roomId && finishDraging(parseInt(roomId));
  };

  const onDragOverRoom = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const onDragLeaveRoom = (event: React.DragEvent<HTMLDivElement>) => {
    setDragOver(false);
  };

  const [newName, setNewName] = useState<string>(roomName);
  const [editableName, setEditableName] = useState<boolean>(false);

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.currentTarget.value);
  };

  const onNameClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setEditableName(true);
  };

  const onNameBlur = () => {
    setEditableName(false);
  };

  const onKeydownName = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newName) {
      nameChanged(id, newName);
      setEditableName(false);
    }
  };

  const onChangeLink = (event: React.ChangeEvent<HTMLInputElement>) => {
    linkChanged(id, event.currentTarget.value);
  };

  return (
    <div
      className={`flex flex-col border-2 dark:border-gray-700 w-full m-4 p-4 ${activeClass}`}
      onDragEnter={onDragOverRoom}
      onDragLeave={onDragLeaveRoom}
      onDragOver={onDragOverRoom}
      onDrop={onDrop}
      data-room-id={id}
    >
      {!editableName && (
        <div className="flex h-16">
          <span
            onClick={onNameClick}
            className="self-center font-extrabold mr-2"
          >
            {roomName}
          </span>
          {names.map((name) => {
            return (
              <div
                key={name}
                className={
                  "shadow border-1 p-3 m-2 rounded-lg bg-blue-100 font-bold hover:bg-sky-600 hover:text-white " +
                  (selectedPerson === name ? "bg-green-100" : "bg-blue-100")
                }
                onDragStart={onDragStartName}
                draggable
              >
                {name}
              </div>
            );
          })}
        </div>
      )}

      {editableName && (
        <input
          type={"text"}
          className="font-extrabold"
          placeholder="Room name"
          onKeyDown={onKeydownName}
          onChange={onChangeName}
          value={newName}
          autoFocus={editableName}
          onBlur={onNameBlur}
        />
      )}

      <div className="flex self-start w-full">
        <b className="mr-2">Link:</b>
        <input
          type={"text"}
          className="self-center dark:bg-gray-200 pl-1 outline-slate-500 text-violet-400 grow"
          placeholder="Click to add"
          onChange={onChangeLink}
          value={link}
        />
        <span className="ml-2">
          <a href={link} target={"_blank"}>
            <ArrowTopRightOnSquareIcon className="h-6 w-6" />
          </a>
        </span>
      </div>
    </div>
  );
};
