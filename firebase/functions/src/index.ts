import { Request, Response } from "express";

const functions = require("firebase-functions");
import { initializeApp } from "firebase-admin/app";

const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

const cors = require("cors")({
  origin: true,
});

type Assignation = {
  name: string;
  roomId: number;
};

type Room = {
  id: number;
  name: string;
  link?: string;
};

type RoomsInfo = {
  names: string[];
  assignations: Assignation[];
  rooms: Room[];
};

type OnlyCalendarInfo = {
  description: string;
  names: string[];
  untilDate: string;
  rotation_frequency: string;
};

type CalendarInfo = OnlyCalendarInfo & RoomsInfo;

const DEFAULT_CALENDAR_VALUES = {
  names: ["Paco", "Alejandro", "Elna", "Laura"],
  description: "",
  untilDate: "",
  rotation_frequency: "1",
  assignations: [{ name: "Paco", roomId: 1 }],
  rooms: [
    { id: 1, name: "Room 1" },
    { id: 2, name: "Room 2" },
  ],
} as CalendarInfo;


export const getCalendarInfo = functions.https.onRequest(async (request: Request, response: Response) => {
  if (request.method === "OPTIONS") {
    cors(request, response, async () => {
      response.send();
    });
    return;
  }

  if (request.method !== "GET") {
    response.status(403).send("Forbidden!");
    return;
  }

  const apiKey = request.headers["x-api-key"];

  if (!apiKey) {
    response.status(403).send("Forbidden!");
    return;
  }

  cors(request, response, async () => {
    const doc = await getFirestore().collection("extreme-programming").doc(apiKey).get();

    if (!doc.exists) {
      console.log("No such document!");

      response.json(DEFAULT_CALENDAR_VALUES);
    } else {
      response.json(doc.data());
    }
  });
});

export const setCalendarInfo = functions.https.onRequest(async (request: Request, response: Response) => {
  if (request.method === "OPTIONS") {
    cors(request, response, async () => {
      response.send();
    });
    return;
  }

  if (request.method !== "POST") {
    response.status(403).send("Forbidden!");
    return;
  }

  const apiKey = request.headers["x-api-key"];

  if (!apiKey) {
    response.status(403).send("Forbidden!");
    return;
  }


  cors(request, response, async () => {
    const data = {
      ...request.body,
      last_modification: new Date(),
    };

    const result = await getFirestore().collection("extreme-programming").doc(apiKey).set(data, { merge: true});

    response.json({
      result,
      data
    });
  });
});

export const pairingPairs = functions.https.onRequest(async (request: Request, response: Response) => {
  if (request.method !== "GET") {
    response.status(403).send("Forbidden!");
    return;
  }

  const apiKey = request.headers["x-api-key"];

  if (!apiKey) {
    response.status(403).send("Forbidden!");
    return;
  }

  cors(request, response, async () => {
    const doc = await getFirestore().collection("extreme-programming").doc(apiKey).get();

    if (!doc.exists) {
      console.log("No such document!");

      response.sendStatus(404);

      return;
    }

    const data = doc.data();

    const pairs = data.rooms.reduce((resultArray : Record<string, String[]>, room : Room) => {
      resultArray[room.name] = participantsForRoom(room, data.assignations);

      return resultArray;
    }, {});

    return response.json(pairs);
  });
});

const participantsForRoom = ((room: Room, assignations: Assignation[]) => {
  return assignations
    .filter(assignation => assignation.roomId == room.id)
    .map((assignation) => assignation.name);
});