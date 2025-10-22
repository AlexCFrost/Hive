const passport = require("passport");
const UserModel = require("../Model/userModel");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL || 'http://localhost:3000'}/bee/user/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let email = profile.emails ? profile.emails[0].value : null;

        let user = await UserModel.findOne({ googleId: profile.id });

        if (!user) {
          user = new UserModel({
            googleId: profile.id,
            email: email,
            userName: profile.displayName,
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize user data into the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserialize user data from the session
passport.deserializeUser(async function (id, done) {
  try {
    const user = await UserModel.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL || 'http://localhost:3000'}/bee/user/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let email = profile.emails ? profile.emails[0].value : null;

        if (!email) {
          return done(new Error('No email provided from Google'), null);
        }

        let user = await UserModel.findOne({ googleId: profile.id });

        if (!user) {
          const existingUser = await UserModel.findOne({ email });
          
          if (existingUser) {
            existingUser.googleId = profile.id;
            await existingUser.save();
            user = existingUser;
          } else {
            const randomPassword = Math.random().toString(36).slice(-10) + 
                                  Math.random().toString(36).toUpperCase().slice(-2) + 
                                  '@1';
            
            user = new UserModel({
              googleId: profile.id,
              email: email,
              username: profile.displayName,
              password: await require('bcrypt').hash(randomPassword, 10)
            });
            await user.save();
          }
        }

        const token = createToken(user._id);

        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize user data into the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserialize user data from the session
passport.deserializeUser(async function (id, done) {
  try {
    const user = await UserModel.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


module.exports = passport;