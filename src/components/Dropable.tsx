import { useState } from "react";

export interface DropableProps {
  children: JSX.Element;
  onDrop: () => void;
  styles?: string;
}

export default function ({ children, onDrop, styles }: DropableProps) {
  const [isHover, setIsHover] = useState<boolean>(false);
  const activeClassNewRoom = isHover
    ? "border-2 border-yellow-400 dark:border-yellow-400"
    : "border-2";

    console.log(isHover);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsHover(true);
  };

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    setIsHover(false);
  };

  const onDropEvent = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsHover(false);

    onDrop();
  };

  return (
    <div
      className={`${activeClassNewRoom} ${styles}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDropEvent}
    >
      {children}
    </div>
  );
}
