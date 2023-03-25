import React, { Suspense, useContext, useEffect, useState } from "react";
import { ApiKeyContext, SelectedPersonContext } from "../App";
import Dropable from "../components/Dropable";
import Loading from "../components/Loading";
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
  const [initialized, setInitialized] = useState<boolean>(false);

  const selectedPerson = useContext(SelectedPersonContext);

  const updateRoomsInfo = (data: Partial<RoomsInfo>) => {
    setRoomsInfo((actualData) => {
      return { ...actualData, ...data };
    });
  };

  useEffect(() => {
    if (apiKey) {
      fetchCalendarInfo(apiKey)
        .then((data) => {
          setRoomsInfo(data);
          setInitialized(true);
        })
        .catch((error) => console.log("error", error));
    }
  }, [apiKey]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      apiKey && initialized && storeCalendarInfo(apiKey, roomsInfo);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [apiKey, roomsInfo]);

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

  const onDragStartName = (event: React.DragEvent<HTMLDivElement>) => {
    setMovingPerson(event.currentTarget.innerText);
  };

  const onDropOnNewRoom = () => {
    const newRoomId = createNewRoom(`Room ${roomsInfo.rooms.length + 1}`);
    assignToRoom(newRoomId);
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
      { initialized && (
        <section>
          <section className="flex">
            <Dropable
              onDrop={unAssign}
              styles="m-4 border-2 p-2 dark:border-gray-700"
            >
              <>
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
              </>
            </Dropable>
            <section className="w-full">
              <section className="pr-8">
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

                <div className={`flex m-4 w-full`}>
                  <Dropable onDrop={onDropOnNewRoom} styles="w-full">
                    <input
                      type={"text"}
                      className={`self-center p-4 dark:bg-gray-200 outline-gray-400 w-full`}
                      placeholder="Drag or click to add new room"
                      onKeyDown={onKeydownNewRoom}
                      onChange={onNewRoomChange}
                      value={newRoom}
                    />
                  </Dropable>
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
      )}
      { !initialized && <Loading/> }
    </>
  );
};
