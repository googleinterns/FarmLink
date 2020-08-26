const express = require("express");
const authRoute = express.Router();
const auth = require("../util/auth");
const { admin, db } = require("../util/admin");
const config = require("../util/config");

const firebase = require("firebase");

firebase.initializeApp(config);

const { validateLoginData, validateSignUpData } = require("../util/validators");

// Login
authRoute.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(403)
        .json({ general: "wrong credentials, please try again" });
    });
});

authRoute.post("/signup", (req, res) => {
  const newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    country: req.body.country,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username,
  };

  const { valid, errors } = validateSignUpData(newUser);

  if (!valid) return res.status(400).json(errors);

  let token, userId;
  db.doc(`/users/${newUser.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ username: "this username is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idtoken) => {
      token = idtoken;
      const userCredentials = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        phoneNumber: newUser.phoneNumber,
        country: newUser.country,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };
      return db.doc(`/users/${newUser.username}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email already in use" });
      } else {
        return res
          .status(500)
          .json({ general: "Something went wrong, please try again" });
      }
    });
});

function deleteImage(imageName) {
  const bucket = admin.storage().bucket();
  const path = `${imageName}`;
  return bucket
    .file(path)
    .delete()
    .then(() => {
      return;
    })
    .catch((error) => {
      return;
    });
};

// Upload profile picture
authRoute.post("/user/image", auth, (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");
  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/png" && mimetype !== "image/jpeg") {
      return res.status(400).json({ error: "Wrong file type submited" });
    }
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${req.user.username}.${imageExtension}`;
    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });
  deleteImage(imageFileName);
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.username}`).update({
          imageUrl,
        });
      })
      .then(() => {
        return res.json({ message: "Image uploaded successfully" });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ error: error.code });
      });
  });
  busboy.end(req.rawBody);
});

authRoute.get("/user", auth, (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.userCredentials = doc.data();
        return res.json(userData);
      }
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: error.code });
    });
});

authRoute.post("/user", auth, (req, res) => {
  let document = db.collection("users").doc(`${req.user.username}`);
  document
    .update(req.body)
    .then(() => {
      res.json({ message: "Updated successfully" });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        message: "Cannot Update the value",
      });
    });
});

module.exports = authRoute;
