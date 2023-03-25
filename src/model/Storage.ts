export type Assignation = {
  name: string;
  roomId: string;
};

export type Room = {
  id: string;
  name: string;
  link?: string;
};

export type RoomsInfo = {
  names: string[];
  assignations: Assignation[];
  rooms: Room[];
};

export type OnlyCalendarInfo = {
  description: string;
  names: string[];
  untilDate: string;
  rotation_frequency: string;
};

export const DEFAULT_CALENDAR_VALUES = {
  names: ["Paco", "Alejandro", "Elna", "Laura"],
  description: "",
  untilDate: "",
  rotation_frequency: "1",
  assignations: [{ name: "Paco", roomId: "1" }],
  rooms: [
    { id: "1", name: "Room 1" },
    { id: "2", name: "Room 2" },
  ],
} as CalendarInfo;

export type CalendarInfo = OnlyCalendarInfo & RoomsInfo;

const baseUrl = import.meta.env.VITE_API_HOST;

export const storeCalendarInfo = (apiKey: string, data : Partial<CalendarInfo>) => {
    fetch(`${baseUrl}/setCalendarInfo`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "origin": window.location.hostname,
        "content-type": "application/json",
      },
      body: JSON.stringify(data)
    }).then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

export const fetchCalendarInfo = async (apiKey : string) : Promise<CalendarInfo> => {
    return fetch(`${baseUrl}/getCalendarInfo`, {
      headers: {
        "x-api-key": apiKey,
        "origin": "http://localhost:5173/"
      }
    }).then((response) => {
      if (response.status === 404) {
        // return Promise.resolve(DEFAULT_CALENDAR_VALUES);
        return Promise.reject("Api key not found");
      }
      return response.json();
    })
      .then(response => {
        return Promise.resolve({
                names: response.names ?? [],
                description: response.description ?? "",
                rotation_frequency: response.rotation_frequency ?? 1,
                untilDate: response.until_date ?? "",
                assignations: response.assignations ?? [],
                rooms: response.rooms ?? [],
        });
      });
}