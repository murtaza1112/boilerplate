const { jwtExpiryTime, secretOrKey } = require("./keys");
const jwt = require("jsonwebtoken");

// login and logout functions to save adn clear cookies

module.exports = {
  login: function login(user, res) {
    const payload = {
      user,
      expiration: Date.now() + parseInt(jwtExpiryTime),
    };
    const token = jwt.sign(JSON.stringify(payload), secretOrKey);

    // encrypt user data to token and pass to cookie
    res
      .cookie("jwt", token, {
        httpOnly: true,
        secure: false, //--> SET TO TRUE ON PRODUCTION
      })
      .status(200)
      .json(user);
  },
  logout: function logout(req, res) {
    if (req.cookies["jwt"]) {
      // clear out the cookie if it exists
      res.clearCookie("jwt");
    }
  },
};
