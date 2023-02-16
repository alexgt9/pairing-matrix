import React, { KeyboardEvent, useEffect, useState } from "react";
import PairingRoom from "../components/PairingRoom";

const splitIntoChunks = (names: string[], chunkSize: number): string[][] => {
  const result = [];
  for (let i = 0; i < names.length; i += chunkSize) {
    const chunk = names.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
};

type Room = {
  id: string;
  name: string;
  link?: string;
}

type RoomWithParticipants = {
  id: string;
  name: string;
  link?: string;
  participants: string[];
}

type Assignation = {
  name: string;
  roomId: string|undefined;
}

const TO_ASSIGN_ROOM = 'toAssign';

export default () => {
  const [newName, setNewName] = useState<string>("");
  const [names, setNames] = useState<string[]>([
    "Paco",
    "Alejandro",
    "Elna",
    "Laura",
  ]);
  const [assignations, setAssignations] = useState<Assignation[]>([{ name: "Paco", roomId: "Room 1" }]);
  const [error, setError] = useState<boolean>(false);
  const [movingPerson, setMovingPerson] = useState<string | undefined>();

  const rooms = splitIntoChunks(names, 2);
  const [realRooms, setRealRooms] = useState<Room[]>([{ id: "Room 1", name: "Room 1"}]);

  const participantsWithoutRoom = names.filter(name => {
    return assignations.find(assignation => assignation.name === name) === undefined;
  });

  const participantsForRoom = (roomId: string) => {
    return assignations.filter(assignation => assignation.roomId == roomId).map(assignation => assignation.name);
  }

  const roomsWithParticipants = realRooms.map(room => { 
    return { id: room.id, name: room.name, participants: participantsForRoom(room.id)} as RoomWithParticipants;
  });

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
    const newAssignations = [...assignations, { name: movingPerson, roomId: room } as Assignation];
    setAssignations(newAssignations);
  };


  const [dragOver, setDragOver] = useState<boolean>(false);
  const activeClass = dragOver ? "border-yellow-400" : "";

  const onDragStartName = (event: React.DragEvent<HTMLDivElement>) => {
    onStartDraging(event.currentTarget.innerText);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);

    const room = event.currentTarget.dataset.room;
    room && onFinishDraging(room);
  };

  const onDragOverRoom = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const onDragLeaveRoom = (event: React.DragEvent<HTMLDivElement>) => {
    setDragOver(false);
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
        <section className="flex">
          <section 
            className="m-4" 
            onDragOver={onDragOverRoom}
            onDragEnter={onDragOverRoom}
            onDragLeave={onDragLeaveRoom}
            onDrop={onDrop}
            data-room={TO_ASSIGN_ROOM}
            >
            {participantsWithoutRoom.map((item) => (
                <div
                  className="shadow border-1 p-3 m-2 rounded-lg bg-blue-100 font-bold hover:bg-sky-600 hover:text-white"
                  key={item}
                  onDragStart={onDragStartName}
                  draggable
                >
                  {item}
                </div>
              ))}
          </section>
          <section>
            {roomsWithParticipants.map((room) => (
              <PairingRoom
                key={room.id}
                roomName={room.name}
                names={participantsForRoom(room.id)}
                link={room.link}
                startDraging={onStartDraging}
                finishDraging={onFinishDraging}
              />
            ))}
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
        </section>
      </section>
    </>
  );
};
