export type Assignation = {
  name: string;
  roomId: number;
};

export type Room = {
  id: number;
  name: string;
  link?: string;
};

export type CalendarInfo = {
  description: string;
  names: string[];
  untilDate: string;
  rotation_frequency: string;
  assignations: Assignation[];
  rooms: Room[];
};

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
        return Promise.reject("Document not found")
      }
      return response.json()
    })
      .then(response => {
        return Promise.resolve({
                names: response.names ?? ["Paco", "Aleh"],
                description: response.description,
                rotation_frequency: response.rotation_frequency ? response.rotation_frequency?.toString() : "1",
                untilDate: response.until_date ?? "",
                assignations: response.assignations ?? [],
                rooms: response.rooms ?? [],
        });
      });
}