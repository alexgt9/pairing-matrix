import { useState } from "react";

export interface DropableProps {
  children: JSX.Element;
  onDrop: (event: React.DragEvent<HTMLDivElement>, id: number | undefined) => void;
  styles?: string;
  dataId?: number | undefined;
}

export default function ({ children, onDrop, styles, dataId }: DropableProps) {
  const [isHover, setIsHover] = useState<boolean>(false);
  const activeClassNewRoom = isHover
    ? "border-2 border-yellow-400 dark:border-yellow-400"
    : "border-2";

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

    onDrop(event, dataId);
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
