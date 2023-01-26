const functions = require("firebase-functions");
// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest(async (request: any, response: any) => {
  const writeResult = await admin.firestore().collection("extreme-programming").add({description: "From cloud function"});
  functions.logger.info("Hello logs!", {structuredData: true});
  response.json({
    message: "Hello from Firebase!",
    result: `Message with ID: ${writeResult.id} added.`,
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
