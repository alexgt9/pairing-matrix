import React, { Suspense, useContext, useEffect, useState } from "react";
import { ApiKeyContext, SelectedPersonContext } from "../App";
import Dropable from "../components/ManualPairs/Dropable";
import Loading from "../components/Shared/Loading";
import PairingRoom from "../components/ManualPairs/PairingRoom";
import {
  Assignation,
  DEFAULT_CALENDAR_VALUES,
  fetchCalendarInfo,
  Room,
  RoomsInfo,
  storeCalendarInfo,
} from "../model/Storage";
import Unassigned from "../components/ManualPairs/Unassigned";

type RoomWithParticipants = Room & {
  participants: string[];
};

export default () => {
  const [roomsInfo, setRoomsInfo] = useState<RoomsInfo>(
    DEFAULT_CALENDAR_VALUES
  );

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

  const onNewName = (newName: string) => {
    const newNames = [...roomsInfo.names, newName];
    updateRoomsInfo({ names: newNames });
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
      {initialized && (
        <section>
          <section className="flex">
            <Unassigned
              onDrop={unAssign}
              names={roomsInfo.names}
              unassignedNames={participantsWithoutRoom}
              onNewName={onNewName}
              selectedPerson={selectedPerson}
              onDragging={setMovingPerson}
            />
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
      {!initialized && <Loading />}
    </>
  );
};
