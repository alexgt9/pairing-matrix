import React, { useContext, useEffect, useState } from "react";
import { ApiKeyContext } from "../App";
import PairingRoom from "../components/PairingRoom";
import {
  Assignation,
  fetchCalendarInfo,
  Room,
  RoomsInfo,
  storeCalendarInfo,
} from "../model/Storage";

type RoomWithParticipants = Room & {
  participants: string[];
};

const TO_ASSIGN_ROOM = "toAssign";

export default () => {
  const [roomsInfo, setRoomsInfo] = useState<RoomsInfo>({
    names: ["Paco", "Alejandro"],
    assignations: [{ name: "Paco", roomId: 1 }],
    rooms: [
      { id: 1, name: "Room 1" },
      { id: 2, name: "Room 2" },
    ],
  });

  const [newName, setNewName] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [movingPerson, setMovingPerson] = useState<string | undefined>();

  const [newRoom, setNewRoom] = useState<string>("");
  const [errorRoom, setErrorRoom] = useState<boolean>(false);

  const apiKey = useContext(ApiKeyContext);

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>();

  const updateRoomsInfo = (data: Partial<RoomsInfo>) => {
    const fullData = { ...roomsInfo, ...data };
    setRoomsInfo(fullData);

    if (apiKey) {
      timeoutId && clearTimeout(timeoutId);
      setTimeoutId(setTimeout(() => storeCalendarInfo(apiKey, fullData), 3000));
    }
  };

  useEffect(() => {
    if (apiKey) {
      fetchCalendarInfo(apiKey)
        .then(setRoomsInfo)
        .catch((error) => console.log("error", error));
    }``
  }, [apiKey]);

  const participantsWithoutRoom = roomsInfo.names.filter((name) => {
    return (
      roomsInfo.assignations.find(
        (assignation) => assignation.name === name
      ) === undefined
    );
  });

  const participantsForRoom = (roomId: number) => {
    return roomsInfo.assignations
      .filter((assignation) => assignation.roomId == roomId)
      .map((assignation) => assignation.name);
  };

  const roomsWithParticipants = roomsInfo.rooms.map((room) => {
    return {
      ...room,
      participants: participantsForRoom(room.id),
    } as RoomWithParticipants;
  });

  const onNewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.currentTarget.value);
    setError(false);
  };

  const onKeydownNewName = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newName) {
      if (roomsInfo.names.includes(newName)) {
        setError(true);

        return;
      }

      const newNames = [...roomsInfo.names, newName];
      updateRoomsInfo({ names: newNames });

      setNewName("");
      setError(false);
    }
  };

  const onNewRoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoom(event.currentTarget.value);
    setErrorRoom(false);
  };

  const onKeydownNewRoom = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newRoom) {
      if (roomsInfo.rooms.some((room) => room.name === newRoom)) {
        setErrorRoom(true);

        return;
      }

      const newRooms = [
        ...roomsInfo.rooms,
        { id: roomsInfo.rooms.length + 1, name: newRoom },
      ];
      updateRoomsInfo({ rooms: newRooms });

      setNewRoom("");
      setErrorRoom(false);
    }
  };

  const unAssign = () => {
    const newAssignations = roomsInfo.assignations.filter(
      (assignation) => assignation.name !== movingPerson
    );

    updateRoomsInfo({ assignations: newAssignations });
  };

  const assignToRoom = (roomId: number) => {
    const newAssignations = [
      ...roomsInfo.assignations.filter(
        (assingation) => assingation.name !== movingPerson
      ),
      { name: movingPerson, roomId: roomId } as Assignation,
    ];

    updateRoomsInfo({ assignations: newAssignations });
  };

  const [dragOver, setDragOver] = useState<boolean>(false);

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

  const onRoomNameChanged = (roomId: number, roomName: string) => {
    const oldRoom = roomsInfo.rooms.find((room) => room.id === roomId);
    const newRooms = [
      ...roomsInfo.rooms.filter((room) => room.id !== roomId),
      { id: oldRoom?.id, name: roomName, link: oldRoom?.link } as Room,
    ].sort((a, b) => a.id - b.id);

    updateRoomsInfo({ rooms: newRooms });
  };

  const onRoomLinkChanged = (roomId: number, link: string) => {
    const oldRoom = roomsInfo.rooms.find((room) => room.id === roomId);
    const newRooms = [
      ...roomsInfo.rooms.filter((room) => room.id !== roomId),
      { id: oldRoom?.id, name: oldRoom?.name, link: link } as Room,
    ].sort((a, b) => a.id - b.id);

    updateRoomsInfo({ rooms: newRooms });
  };

  return (
    <>
      <section className="ml-4 mt-4">
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
                <span className="font-bold text-red-700">{newName}</span> is
                already in the list
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
            <section>
              {roomsWithParticipants.map((room) => (
                <PairingRoom
                  key={room.id}
                  id={room.id}
                  roomName={room.name}
                  names={room.participants}
                  link={room.link}
                  startDraging={setMovingPerson}
                  finishDraging={assignToRoom}
                  nameChanged={onRoomNameChanged}
                  linkChanged={onRoomLinkChanged}
                />
              ))}
            </section>
            <section>
              <div className={`flex border-2 w-max m-4`}>
                <input
                  type={"text"}
                  className="self-center p-4"
                  placeholder="Click to add new room"
                  onKeyDown={onKeydownNewRoom}
                  onChange={onNewRoomChange}
                  value={newRoom}
                />
              </div>
              {errorRoom && (
                <div className="self-start text-red-400 font-semibold">
                  <span className="font-bold text-red-700">{newRoom}</span>{" "}
                  already exists
                </div>
              )}
            </section>
          </section>
        </section>
      </section>
    </>
  );
};
