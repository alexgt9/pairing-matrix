import { useState } from "react";
import { CalendarInfo } from "../model/Storage";

export default () => {
  const [calendarInfo, setCalendarInfo] = useState<Partial<CalendarInfo>>({
    names: ["Paco", "Alejandro", "Elna", "Laura"],
  });
  return (
    <div>Hola pairs</div>
  );
};