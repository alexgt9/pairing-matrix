import React, { useContext, useEffect, useState } from "react";
import { ApiKeyContext, SelectedPersonContext } from "../App";
import PairingRoom from "../components/PairingRoom";
import {
  Assignation,
  DEFAULT_CALENDAR_VALUES,
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
  const [roomsInfo, setRoomsInfo] = useState<RoomsInfo>(
    DEFAULT_CALENDAR_VALUES
  );

  const [newName, setNewName] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [movingPerson, setMovingPerson] = useState<string | undefined>();

  const [newRoom, setNewRoom] = useState<string>("");
  const [errorRoom, setErrorRoom] = useState<boolean>(false);

  const apiKey = useContext(ApiKeyContext);
  const selectedPerson = useContext(SelectedPersonContext);

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>();

  const updateRoomsInfo = (data: Partial<RoomsInfo>) => {
    setRoomsInfo((actualData) => {
      const fullData = { ...actualData, ...data };

      if (apiKey) {
        timeoutId && clearTimeout(timeoutId);
        setTimeoutId(
          setTimeout(() => storeCalendarInfo(apiKey, fullData), 3000)
        );
      }

      return { ...actualData, ...data };
    });
  };

  useEffect(() => {
    if (apiKey) {
      fetchCalendarInfo(apiKey)
        .then(setRoomsInfo)
        .catch((error) => console.log("error", error));
    }
    ``;
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

      createNewRoom(newRoom);
    }
  };

  const createNewRoom = (name: string): number => {
    const newId = roomsInfo.rooms.length + 1;
    const newRooms = [...roomsInfo.rooms, { id: newId, name }];
    updateRoomsInfo({ rooms: newRooms });

    setNewRoom("");
    setErrorRoom(false);

    return newId;
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
  const [dragOverNewRoom, setDragOverNewRoom] = useState<boolean>(false);

  const onDragStartName = (event: React.DragEvent<HTMLDivElement>) => {
    setMovingPerson(event.currentTarget.innerText);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);

    unAssign();
  };

  const onDropOnNewRoom = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOverNewRoom(false);

    const newRoomId = createNewRoom(`Room ${roomsInfo.rooms.length + 1}`);
    assignToRoom(newRoomId);
  };

  const onDragOverNewRoom = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOverNewRoom(true);
  };

  const onDragLeaveNewRoom = (event: React.DragEvent<HTMLDivElement>) => {
    setDragOverNewRoom(false);
  };

  const onDragOverRoom = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const onDragLeaveRoom = (event: React.DragEvent<HTMLDivElement>) => {
    setDragOver(false);
  };

  const activeClass = dragOver
    ? "border-yellow-400 dark:border-yellow-400"
    : "";
  const activeClassNewRoom = dragOverNewRoom
    ? "border-yellow-400 dark:border-yellow-400"
    : "";

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
      <section>
        <section className="flex">
          <section
            className={`m-4 border-2 p-2 dark:border-gray-700 ${activeClass}`}
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
            {participantsWithoutRoom.map((item) => {
              const selectedPersonClass =
                selectedPerson === item ? "bg-green-100" : "bg-blue-100";
              return (
                <div
                  className={`shadow border-1 p-3 m-2 rounded-lg font-bold hover:bg-sky-600 hover:text-white ${selectedPersonClass}`}
                  key={item}
                  onDragStart={onDragStartName}
                  draggable
                >
                  {item}
                </div>
              );
            })}
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
                  selectedPerson={selectedPerson ?? ""}
                />
              ))}
            </section>
            <section>
              <div className={`flex border-2 w-max m-4 ${activeClassNewRoom}`}>
                <input
                  type={"text"}
                  className={`self-center p-4 dark:bg-gray-200 outline-gray-400`}
                  placeholder="Click to add new room"
                  onKeyDown={onKeydownNewRoom}
                  onChange={onNewRoomChange}
                  value={newRoom}
                  onDragOver={onDragOverNewRoom}
                  onDragLeave={onDragLeaveNewRoom}
                  onDrop={onDropOnNewRoom}
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
