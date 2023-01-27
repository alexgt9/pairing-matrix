import { Request, Response } from "express";

const functions = require("firebase-functions");
// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

export const getCalendarInfo = functions.https.onRequest(async (request: Request, response: Response) => {
  const apiKey = request.headers["x-api-key"];

  const doc = await admin.firestore().collection("extreme-programming").doc(apiKey).get();

  if (!doc.exists) {
    console.log("No such document!");

    response.sendStatus(404);
  } else {
    response.json(doc.data());
  }
});

export const setCalendarInfo = functions.https.onRequest(async (request: Request, response: Response) => {
  const apiKey = request.headers["x-api-key"];
  const data = {
    description: request.body.description ?? "",
    pairs: request.body.pairs ?? ["Alejandro", "Javi", "Laura", "Elna"],
    "rotation-frequency": request.body["rotation-frequency"] ?? 1,
    "until-date": request.body["until-date"] ?? null,
  };

  const result = await admin.firestore().collection("extreme-programming").doc(apiKey).set(data);

  response.json({
    result,
    data
  });
});

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
// exports.makeUppercase = functions.firestore.document("/extreme-programming/{documentId}")
//     .onCreate((snap: any, context: any) => {
//       // Grab the current value of what was written to Firestore.
//       const description = snap.data().description;

//       // Access the parameter `{documentId}` with `context.params`
//       functions.logger.log("Uppercasing", context.params.documentId, description);

//       const uppercase = description.toUpperCase();

//       // You must return a Promise when performing asynchronous tasks inside a Functions such as
//       // writing to Firestore.
//       // Setting an 'uppercase' field in Firestore document returns a Promise.
//       return snap.ref.set({uppercase}, {merge: true});
//     });
