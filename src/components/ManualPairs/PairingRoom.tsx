import React, { useState } from "react";
import { ArrowTopRightOnSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import Dropable from "./Dropable";

export type PairingRoomProps = {
  id: string;
  roomName: string;
  names: string[];
  link?: string;
  startDraging: (name: string) => void;
  finishDraging: (roomName: string) => void;
  nameChanged: (id: string, newName: string) => void;
  linkChanged: (id: string, newLink: string) => void;
  selectedPerson: string;
  onDelete: (id: string) => void;
};

export default ({
  id,
  roomName,
  names,
  link = "",
  startDraging,
  finishDraging,
  nameChanged,
  linkChanged,
  selectedPerson,
  onDelete,
}: PairingRoomProps) => {
  const onDragStartName = (event: React.DragEvent<HTMLDivElement>) => {
    startDraging(event.currentTarget.innerText);
  };

  const onDrop = (_event: React.DragEvent<HTMLDivElement>, roomId: string | undefined) => {
    roomId && finishDraging(roomId);
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

  const onDeleteClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onDelete(id);
  };

  return (
    <Dropable onDrop={onDrop} styles={`flex flex-col border-2 dark:border-gray-700 w-full m-4 p-4 relative`} dataId={id}>
      <>
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
                  title="Drag to move to another room"
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
            type="url"
            className="self-center dark:bg-gray-200 pl-1 outline-slate-500 text-violet-400 grow"
            placeholder="Click to add"
            onChange={onChangeLink}
            value={link}
          />
          <span className="ml-2">
            <a href={link} target={"_blank"} title="Go to room link">
              <ArrowTopRightOnSquareIcon className="h-6 w-6" />
            </a>
          </span>
        </div>
        <button className="absolute right-4 top-4" title="Delete room" onClick={onDeleteClick}>
          <TrashIcon className="h-6 w-6 text-red-500 hover:text-red-700" />
        </button>
      </>
    </Dropable>
  );
};
