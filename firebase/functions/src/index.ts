import { Request, Response } from "express";

const functions = require("firebase-functions");
// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const cors = require("cors")({
  origin: true,
});

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
    const doc = await admin.firestore().collection("extreme-programming").doc(apiKey).get();

    if (!doc.exists) {
      console.log("No such document!");

      response.sendStatus(404);
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
      description: request.body.description ?? "",
      names: request.body.names ?? ["Alejandro", "Javi", "Laura", "Elna"],
      rotation_frequency: request.body["rotation_frequency"] ?? 1,
      until_date: request.body["until_date"] ?? null,
      last_modification: new Date(),
    };

    const result = await admin.firestore().collection("extreme-programming").doc(apiKey).set(data);

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
    const perChunk = 2;
    const doc = await admin.firestore().collection("extreme-programming").doc(apiKey).get();
    const pairs = doc.data().names.reduce((resultArray : Record<string, String[]>, item : string, index : number) => {
      const chunkIndex = `Room ${Math.floor(index/perChunk)}`;

      if(!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] // start a new chunk
      }
    
      resultArray[chunkIndex].push(item)
    
      return resultArray
    }, {});


    if (!doc.exists) {
      console.log("No such document!");

      response.sendStatus(404);
    } else {
      response.json(pairs);
    }
  });
});
