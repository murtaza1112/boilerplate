const passport=require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
var GoogleStrategy = require("passport-google-oauth2").Strategy;

const User = require("../models/User");
const {secretOrKey,jwtExpiryTime,clientId,clientSecret} = require("../config/keys");

module.exports = (passport) => {

  // JWT token stored in the cookie
  // which is send AUTOMATICALLY to client on each request

  const cookieExtractor = (req) => {
    let jwt = null;
    if (req && req.cookies) {
      jwt = req.cookies["jwt"];
    }
    return jwt;
  };

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: secretOrKey,
      },
      (jwtPayload, done) => {
        const { expiration } = jwtPayload;

        if (Date.now() > expiration) {
          done(null, false);
        }else
            done(null, jwtPayload.user);
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: "/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        // passport callback function
        //check if user already exists in our db with the given profile ID
        User.findOne({ googleId: profile.id }).then((currentUser) => {
          if (currentUser) {
            //if we already have a record with the given profile ID
            done(null, currentUser);
          } else {
            //if not, create a new user
            new User({
              googleId: profile.id,
              username : profile.displayName,
              email:profile.email
            })
              .save()
              .then((newUser) => {
                done(null, newUser);
              });
          }
        });
      }
    )
  );
};
