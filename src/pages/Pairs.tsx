import { useContext, useEffect, useState } from "react";
import { ApiKeyContext, SelectedPersonContext } from "../App";
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
import NewRoom from "../components/ManualPairs/NewRoom";
import { v4 } from "uuid";

type RoomWithParticipants = Room & {
  participants: string[];
};

export default () => {
  const apiKey = useContext(ApiKeyContext);
  const selectedPerson = useContext(SelectedPersonContext);

  const [roomsInfo, setRoomsInfo] = useState<RoomsInfo>(
    DEFAULT_CALENDAR_VALUES
  );
  const [initialized, setInitialized] = useState<boolean>(false);

  const [movingPerson, setMovingPerson] = useState<string | undefined>();

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

  const participantsForRoom = (roomId: string) => {
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

  const createNewRoom = (name: string): string => {
    const newId = v4();
    const newRooms = [...roomsInfo.rooms, { id: newId, name }];
    updateRoomsInfo({ rooms: newRooms });

    return newId;
  };

  const unAssign = () => {
    const newAssignations = roomsInfo.assignations.filter(
      (assignation) => assignation.name !== movingPerson
    );

    updateRoomsInfo({ assignations: newAssignations });
  };

  const assignToRoom = (roomId: string) => {
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

  const onRoomNameChanged = (roomId: string, roomName: string) => {
    const oldRoom = roomsInfo.rooms.find((room) => room.id === roomId);
    const newRooms = [
      ...roomsInfo.rooms.filter((room) => room.id !== roomId),
      { id: oldRoom?.id, name: roomName, link: oldRoom?.link } as Room,
    ];

    updateRoomsInfo({ rooms: newRooms });
  };

  const onRoomLinkChanged = (roomId: string, link: string) => {
    const oldRoom = roomsInfo.rooms.find((room) => room.id === roomId);
    const newRooms = [
      ...roomsInfo.rooms.filter((room) => room.id !== roomId),
      { id: oldRoom?.id, name: oldRoom?.name, link: link } as Room,
    ];

    updateRoomsInfo({ rooms: newRooms });
  };

  const onDeleteRoom = (roomId: string) => {
    const newRooms = roomsInfo.rooms.filter(room => room.id !== roomId);
    const newAssignations = roomsInfo.assignations.filter(assignation => assignation.roomId !== roomId);
    updateRoomsInfo({ rooms: newRooms, assignations: newAssignations });
  };

  const deletePerson = (deletedName: string) => {
    const newNames = roomsInfo.names.filter(name => name !== deletedName)
    updateRoomsInfo({ names: newNames });
  };

  return (
    <>
      <section>
        <section className="flex">
          <Unassigned
            onDrop={unAssign}
            names={roomsInfo.names}
            unassignedNames={participantsWithoutRoom}
            onNewName={onNewName}
            selectedPerson={selectedPerson}
            onDragging={setMovingPerson}
            onDelete={deletePerson}
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
                  onDelete={onDeleteRoom}
                />
              ))}

              <div className={`flex m-4 w-full flex-col`}>
                <NewRoom onDrop={onDropOnNewRoom} rooms={roomsInfo.rooms} onNewRoom={createNewRoom} />
              </div>
            </section>
          </section>
        </section>
      </section>
      { !initialized && <Loading />}
    </>
  );
};
