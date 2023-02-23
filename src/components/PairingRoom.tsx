import React, { useState } from "react";

export type PairingRoomProps = {
  roomName: string;
  names: string[];
  link?: string;
  startDraging: (name: string) => void;
  finishDraging: (roomName: string) => void;
  onLinkChange: (link: string) => void;
};

export default ({
  roomName,
  names,
  link,
  startDraging,
  finishDraging,
  onLinkChange
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

  const [newLink, setNewLink] = useState<string>(link ?? "");
  const [editableLink, setEditableLink] = useState<boolean>(false);

  const onChangeLink = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewLink(event.currentTarget.value);
  };

  const onLinkClick = () => {
    setEditableLink(true);
  };

  const onLinkBlur = () => {
    setEditableLink(false);
  };

  const onKeydownLink = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newLink) {
      onLinkChange(newLink);
      setEditableLink(false);
    }
  };

  return (
    <div
      className={`flex flex-col border-2 w-max m-4 p-4 ${activeClass}`}
      onDragEnter={onDragOverRoom}
      onDragLeave={onDragLeaveRoom}
      onDragOver={onDragOverRoom}
      onDrop={onDrop}
      data-room={roomName}
    >
      <div className="flex">
        <span className="self-center font-extrabold mr-2">{roomName}</span>
        {names.map((name) => {
          return (
            <div
              key={name}
              className="shadow border-1 p-3 m-2 rounded-lg bg-blue-100 font-bold hover:bg-sky-600 hover:text-white"
              onDragStart={onDragStartName}
              draggable
            >
              {name}
            </div>
          );
        })}
      </div>
      {!editableLink && link && (
        <div className="self-start">
          <a className="text-blue-400" href="google.com">
            {link}
          </a>
          <span className="ml-2" onClick={onLinkClick}>
            Edit
          </span>
        </div>
      )}
      {(editableLink || !link) && (
        <input
          type={"text"}
          className="self-center font-extrabold"
          placeholder="Link to room"
          onKeyDown={onKeydownLink}
          onChange={onChangeLink}
          value={newLink}
          autoFocus={editableLink}
          onBlur={onLinkBlur}
        />
      )}
    </div>
  );
};
