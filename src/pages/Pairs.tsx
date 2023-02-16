import React, { KeyboardEvent, useEffect, useState } from "react";
import PairingRoom from "../components/PairingRoom";

type Room = {
  id: string;
  name: string;
  link?: string;
};

type RoomWithParticipants = {
  id: string;
  name: string;
  link?: string;
  participants: string[];
};

type Assignation = {
  name: string;
  roomId: string | undefined;
};

const TO_ASSIGN_ROOM = "toAssign";

export default () => {
  const [newName, setNewName] = useState<string>("");
  const [names, setNames] = useState<string[]>([
    "Paco",
    "Alejandro",
    "Elna",
    "Laura",
    "Paco2",
    "Al2ejandro",
    "El2na",
    "La2ura",
  ]);
  const [assignations, setAssignations] = useState<Assignation[]>([
    { name: "Paco", roomId: "Room 1" },
  ]);
  const [error, setError] = useState<boolean>(false);
  const [movingPerson, setMovingPerson] = useState<string | undefined>();

  const [realRooms, setRealRooms] = useState<Room[]>([
    { id: "Room 1", name: "Room 1" },
    { id: "Room 2", name: "Room 2" },
  ]);

  const participantsWithoutRoom = names.filter((name) => {
    return (
      assignations.find((assignation) => assignation.name === name) ===
      undefined
    );
  });

  const participantsForRoom = (roomId: string) => {
    return assignations
      .filter((assignation) => assignation.roomId == roomId)
      .map((assignation) => assignation.name);
  };

  const roomsWithParticipants = realRooms.map((room) => {
    return {
      id: room.id,
      name: room.name,
      participants: participantsForRoom(room.id),
    } as RoomWithParticipants;
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

  const unAssign = () => {
    const newAssignations = assignations.filter((assignation) => assignation.name !== movingPerson);
    setAssignations(newAssignations);
  };

  const assignToRoom = (room: string) => {
    const newAssignations = [
      ...assignations.filter(
        (assingation) => assingation.name !== movingPerson
      ),
      { name: movingPerson, roomId: room } as Assignation,
    ];
    setAssignations(newAssignations);
  };

  const [dragOver, setDragOver] = useState<boolean>(false);
  const activeClass = dragOver ? "border-yellow-400" : "";

  const onDragStartName = (event: React.DragEvent<HTMLDivElement>) => {
    setMovingPerson(event.currentTarget.innerText);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);

    unAssign();
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
      <section className="ml-4 mt-4">
        <header className="text-lg font-extrabold self-start">Rooms</header>
        <section className="flex">
          <section
            className="m-4 border-2 p-2"
            onDragOver={onDragOverRoom}
            onDragEnter={onDragOverRoom}
            onDragLeave={onDragLeaveRoom}
            onDrop={onDrop}
            data-room={TO_ASSIGN_ROOM}
          >
            <h2>Drag to assign a room</h2>
            <input
              onKeyDown={onKeydownNewName}
              className="shadow border-1 p-3 m-2 rounded-lg bg-blue-100 font-bold"
              type="text"
              placeholder="Add participant"
              value={newName}
              onChange={onNewNameChange}
            />
            {error && (
              <div className="self-start text-red-400 font-semibold">
                <span className="font-bold text-red-700">{newName}</span>{" "}
                is already in the list
              </div>
            )}
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
                names={room.participants}
                link={room.link}
                startDraging={setMovingPerson}
                finishDraging={assignToRoom}
              />
            ))}
          </section>
        </section>
      </section>
    </>
  );
};
