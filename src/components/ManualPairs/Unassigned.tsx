import { XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Dropable from "./Dropable";

export interface UnassignedProps {
  onDrop: () => void;
  names: string[];
  unassignedNames: string[];
  onNewName: (newName: string) => void;
  selectedPerson: string | null;
  onDragging: (movingPerson: string) => void;
  onDelete: (name: string) => void;
}

export default function ({
  onDrop,
  names,
  unassignedNames,
  onNewName,
  selectedPerson,
  onDragging,
  onDelete,
}: UnassignedProps) {
  const [newName, setNewName] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const onNewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.currentTarget.value);
    setError(false);
  };

  const onKeydownNewName = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newName) {
      if (names.includes(newName)) {
        setError(true);

        return;
      }

      onNewName(newName);
      setNewName("");
      setError(false);
    }
  };

  const onDragStartName = (event: React.DragEvent<HTMLDivElement>) => {
    onDragging(event.currentTarget.innerText);
  };

  const onClickDelete = (event: React.MouseEvent<SVGAElement>) => {
    const person = event.currentTarget.closest("div")?.innerText
    person && onDelete(person);
    event.preventDefault();
  };

  return (
    <Dropable onDrop={onDrop} styles="m-4 border-2 p-2 dark:border-gray-700">
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
            <span className="font-bold text-red-700">{newName}</span> is already
            in the list
          </div>
        )}
        {unassignedNames.map((item) => {
          const selectedPersonClass =
            selectedPerson === item ? "bg-green-100" : "bg-blue-100";
          return (
            <div
              className={`shadow border-1 p-3 m-2 rounded-lg font-bold hover:bg-sky-600 hover:text-white ${selectedPersonClass} relative`}
              key={item}
              title="Drag to move to a room"
              onDragStart={onDragStartName}
              draggable
            >
              {item}
              <XMarkIcon className="h-6 w-6 text-black-500 hover:text-red-400 absolute top-3 right-3" onClick={onClickDelete} />
            </div>
          );
        })}
      </>
    </Dropable>
  );
}
