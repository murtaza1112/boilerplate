const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { login, logout } = require("../config/auth");

const router = express.Router();

// custom passport middleware to check if user is authenticated or not
var isLoggedIn = function (req, res, next) {

  passport.authenticate("jwt", function (err, user, info) {
    if (err) {
      return next(err);
    }
    console.log(user);
    if (!user) {
      //remove cookies due to expiry
      logout(req, res);
    }
    // assign user to req.user
    req.user = user;
  })(req, res, next);

  if(req.user)return next();

//   user does not exist
  res.status(401).json({error:"You are not logged in"});
};


// local authentication
router.post("/api/signin", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ error: "The user already exists" });
      return;
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    login(newUser, res);
  } catch (err) {
    res.status(401).json({ error: "The user cannot be Signed In." });
  }
});

router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(email,password);

    if (!user) {
      return res.status(400).json({ error: "The email does not exist." });
    }

    //check if password exists
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "The password does not match." });
    }

    login(user, res);
  } catch (err) {
    console.log(err);
    res.send(400).json({ error: err });
  }
});

// google authentication
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  (req, res) => {
    //   user data stored in req.user by passport-google but will not persist for more than session
    login(req.user, res);
  }
);

router.get("/api/protected", isLoggedIn, (req, res) => {
  console.log("Hello");
  console.log(req.user);
  res.status(200).send(req.user);
});

// logout route
router.get("/api/logout", (req, res) => {
  // Clear cookies
  logout(req, res);
  res.json({ success: "The user has been logged out" });
});

module.exports = router;
