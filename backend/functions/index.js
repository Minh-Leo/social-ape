const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();

admin.initializeApp();

const firebaseConfig = {
  apiKey: "AIzaSyB43zDkoj0YILiI65LglUKMWXgqCc_of0Q",
  authDomain: "socialape-cdd8c.firebaseapp.com",
  databaseURL: "https://socialape-cdd8c.firebaseio.com",
  projectId: "socialape-cdd8c",
  storageBucket: "socialape-cdd8c.appspot.com",
  messagingSenderId: "1047075812915",
  appId: "1:1047075812915:web:c8779bd3cd1c94d9c89546"
};

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

app.get("/screams", (req, res) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          userId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(screams);
    })
    .catch(err => console.error(err));
});

// MiddleWare
const FBAuth = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return res.status(403).json({error: "Unauthorized"});
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      console.log(decodedToken);
      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
      req.user.handle = data.docs[0].data().handle;
      return next();
    })
    .catch(err => {
      console.error("Error while verifying token".err);
      return res.status(403).json(err);
    });
};

// POST scream
app.post("/scream", FBAuth, (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({body: "Body can not be empty"});
  }
  const newScream = {
    body: req.body.body,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString()
  };
  db.collection("screams")
    .add(newScream)
    .then(doc => {
      res.json({message: `document ${doc.id} created successfully`});
    })
    .catch(err => {
      res.status(500).json({error: "something went wrong!"});
      console.error(err);
    });
});

// VALIDATION METHOD
const isEmpty = string => {
  if (string.trim() === "") return true;
  else return false;
};
const isEmail = email => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

// SIGNUP Route
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };
  let errors = {};
  if (isEmpty(newUser.email)) {
    errors.email = "Must not be blank";
  } else if (!isEmail(newUser.email)) {
    errors.email = "must be a valid email address";
  }
  if (isEmpty(newUser.password)) errors.password = "Must not be blank";
  if (newUser.password !== newUser.confirmPassword)
    errors.confirmPassword = "Passwords must match";
  if (isEmpty(newUser.handle)) errors.handle = "Must not be blank";
  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({handle: "this handle is taken"});
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId: userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({token});
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({email: "email is already used"});
      } else {
        return res.status(500).json({error: err.code});
      }
    });
});

// LOGIN
app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  let errors = {};
  if (isEmpty(user.email)) {
    errors.email = "Must not be blank";
  } else if (!isEmail(user.email)) {
    errors.email = "must be a valid email address";
  }
  if (isEmpty(user.password)) errors.password = "Must not be blank";
  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({token});
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({general: "wrong credentials, please try again"});
      } else return res.status(500).json({error: err.code});
    });
});

exports.api = functions.region("asia-east2").https.onRequest(app);

// FIREBASE, WITHOUT EXPRESS
// exports.createScream = functions.https.onRequest((req, res) => {
//   if (req.method !== "POST") {
//     return res.status(400).json({error: "Method not allowed!"});
//   }
//   const newScream = {
//     body: req.body.body,
//     userHandle: req.body.userHandle,
//     createdAt: admin.firestore.Timestamp.fromDate(new Date())
//   };

//   admin
//     .firestore()
//     .collection("screams")
//     .add(newScream)
//     .then(doc => {
//       res.json({message: `document ${doc.id} created successfully`});
//     })
//     .catch(err => {
//       res.status(500).json({error: "something went wrong!"});
//       console.error(err);
//     });
// });
