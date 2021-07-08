require("dotenv").config();

// for environment variables
module.exports = {
  mongoURI: process.env.MONGO_URI,
  port: process.env.PORT,
  secretOrKey: process.env.SECRET_OR_KEY,
  jwtExpiryTime: process.env.JWT_EXPIRATION_TIME,
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
};
