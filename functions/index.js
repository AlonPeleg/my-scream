const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const express = require("express");
const app = express();

app.get("/screams", async (req, res) => {
  try {
    const data = await admin
      .firestore()
      .collection("screams")
      .get();
    let screams = [];
    data.forEach(doc => {
      screams.push({
        screamId: doc.id,
        ...doc.data()
      });
    });
    return res.json(screams);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/scream", async (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };
  try {
    const doc = await admin
      .firestore()
      .collection("screams")
      .add(newScream);
    res.json({ message: `document ${doc.id} created successfully` });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

exports.api = functions.region("europe-west1").https.onRequest(app);
