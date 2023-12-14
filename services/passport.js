const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    });
});

passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id })
      .then((existingUser) => {
        if (existingUser) {
          done(null, existingUser);
        }
        else {
          new User({googleId: profile.id}).save()
            .then(user => done(null, user));
        }
      })
  })
);

passport.use(
  new InstagramStrategy({
    clientID: keys.instagramClientId,
    clientSecret: keys.instagramClientSecret,
    callbackURL: '/auth/instagram/callback'
  }, (accessToken, refreshToken, profile, done) => {
    /*User.findOne({ googleId: profile.id })
      .then((existingUser) => {
        if (existingUser) {
          done(null, existingUser);
        }
        else {
          new User({googleId: profile.id}).save()
            .then(user => done(null, user));
        }
      })*/
      console.log("accessToken=",accessToken);
      console.log("profile=", profile);
  })
);
