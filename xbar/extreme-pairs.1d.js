#!/usr/bin/env /Users/alejandrobatanero/.nvm/versions/node/v18.12.1/bin/node

const API_KEY = "";
const YOUR_NAME = "Alejandro";

const https = require('https');
const { exit } = require('process');

// console.log("Room 1 : Aleh & Juan");
// console.log("---");
// console.log(`Room 1 : Aleh & Jose | href=https://thoughtworks.zoom.us/j/98729122068?pwd=M2VNQ1dwR20vTEFKTndIRWJ1ZmVsQT09`);
// console.log(`Room 2 : Anca & Lavinia | href=https://thoughtworks.zoom.us/j/98729122068?pwd=M2VNQ1dwR20vTEFKTndIRWJ1ZmVsQT09`);
// exit;

if (!API_KEY || !YOUR_NAME) {
  console.log("You must set the API_KEY and YOUR_NAME!");
  exit();
}

const options = {
  'method': 'GET',
  'hostname': 'us-central1-extreme-programming-8281c.cloudfunctions.net',
  'path': '/pairingPairs',
  'headers': {
    'x-api-key': API_KEY,
  }
};

const req = https.request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    const body = JSON.parse(Buffer.concat(chunks).toString());
    let found = false;

    for (const [key, value] of Object.entries(body)) {
        if (value.includes(YOUR_NAME)) {
            console.log(`${key} : ${value.toString()}`);
            found = true;
        }
    }

    if (!found) {
        console.log(`Your name ${YOUR_NAME} is not found in the pairs. Did you set it?`);
    }

    console.log("---");

    for (const [key, value] of Object.entries(body)) {
        console.log(`${key} : ${value.toString()} | href=https://thoughtworks.zoom.us/j/roomId`);
    }
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

req.end();