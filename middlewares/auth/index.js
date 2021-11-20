const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { generateToken } = require("../../utils/jwt");
const { user } = require("../../models");

exports.Authentication = (req, res, next) => {
  /**
   * setelah ke middleware -> ke lokal strategy -> authenticate
   */
  passport.Authentication(
    "authentication",
    { session: false },
    (err, userData, info) => {
      if (err) {
        return res.status(500).json({
          message: "Internal Server error",
          error: err.message,
        });
      }

      if (!userData) {
        return res.status(401).json({
          message: info.message,
        });
      }

      req.loginUser = userData;
      next();
    }
  )(req, res, next);
};

passport.use(
  "authentication",
  new LocalStrategy(
    {
      usernameField: "email", //usernameField didapatkan dari req.body.email
      passwordField: "password",
      passReqToCallback: true, // enable read req.body /req.params / req.query
    },
    async (req, email, password, done) => {
      try {
        const token = req.headers.access_token;
        const payload = generateToken(token);
        if (!token) {
          return done(null, false, {
            message: "Please Login",
          });
        }

        const userData = await user.findOne({
          where: {
            id: payload.id,
          },
        });

        if (!userData) {
          return done(null, false, {
            message: "Please Login",
          });
        }

        return done(null, payload, {
          message: "Authenticate Success",
        });
      } catch (error) {
        return done(null, false, {
          message: "Something wrong",
        });
      }
    }
  )
);
