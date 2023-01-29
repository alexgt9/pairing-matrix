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
    pairs: String[],
    rotation_frequency: number,
    until_date: string, 
}

export const storeCalendarInfo = (apiKey: string, data : CalendarInfo) => {
    fetch("http://127.0.0.1:5001/extreme-programming-8281c/us-central1/setCalendarInfo", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "origin": "http://localhost:5173/",
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
    return fetch("http://127.0.0.1:5001/extreme-programming-8281c/us-central1/getCalendarInfo", {
      headers: {
        "x-api-key": apiKey,
        "origin": "http://localhost:5173/"
      }
    }).then((response) => response.json())
      .then(response => {
        return new Promise((resolve, reject) => {
            resolve({
                names: response.pairs.join("\n"),
                description: response.description,
                rotationFrequency: response.rotation_frequency.toString(),
                untilDate: response.until_date ?? "",
            })
        });
      });
}