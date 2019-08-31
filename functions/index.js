const functions = require("firebase-functions");
const admin = require("firebase-admin");

const app = require("express")();
admin.initializeApp();

const firebaseConfig = {
  apiKey: "AIzaSyD29oR4qFsn8qZz77yGbixQUyKHb1FMgsU",
  authDomain: "mysocialapp-fa241.firebaseapp.com",
  databaseURL: "https://mysocialapp-fa241.firebaseio.com",
  projectId: "mysocialapp-fa241",
  storageBucket: "mysocialapp-fa241.appspot.com",
  messagingSenderId: "793377013637",
  appId: "1:793377013637:web:f969f6acdece867a"
};

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

app.get("/screams", async (req, res) => {
  try {
    const data = await admin
      .firestore()
      .collection("screams")
      .orderBy("createdAt", "desc")
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
    createdAt: new Date().toISOString()
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

// Signup route
app.post("/signup", async (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };
  // TODO: validate data
  try {
    const data = await firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password);
    return res
      .status(201)
      .json({ message: `user ${data.user.uid} signed up successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

exports.api = functions.region("europe-west1").https.onRequest(app);
