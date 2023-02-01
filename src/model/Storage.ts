export type CalendarInfo = {
    description: string;
    names: string;
    untilDate: string;
    rotationFrequency: string;
  };

export type CalendarInfoResponse = {
    description: string,
    last_modification: {
        _second: number,
        _nanoseconds: number,
    },
    pairs: string[],
    rotation_frequency: number,
    until_date: string, 
}

const baseUrl = import.meta.env.VITE_API_HOST;

export const storeCalendarInfo = (apiKey: string, data : CalendarInfo) => {
    fetch(`${baseUrl}/setCalendarInfo`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "origin": window.location.hostname,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        description: data.description,
        pairs: data.names.split("\n"),
        rotation_frequency: Number.parseInt(data.rotationFrequency),
        untilDate: data.untilDate,
      })
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
                names: response.pairs.join("\n"),
                description: response.description,
                rotationFrequency: response.rotation_frequency.toString(),
                untilDate: response.until_date ?? "",
        });
      });
}