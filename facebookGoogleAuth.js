const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  session = require("express-session"),
  passport = require("passport"),
  GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
  flash = require("connect-flash"),
  config = require("dotenv");
config.config();
const host = "127.0.0.1";
const port = 7000;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

function checkAuth() {
  return app.use((req, res, next) => {
    if (req.user) next();
    else res.redirect("/login");
  });
}
console.log("dsdsds");
console.log(process.env.GOOGLE_ID);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "you secret key" }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID, //YOUR GOOGLE_CLIENT_ID
      clientSecret: process.env.GOOGLE_SECRET, //YOUR GOOGLE_CLIENT_SECRET
      callbackURL: "http://127.0.0.1:7000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

app.get("/login", (req, res) => {
  res.send("Login page. Please, authorize.");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/home",
  })
);

app.get("/home", checkAuth(), (req, res) => {
  res.send("Home page. You're authorized.");
});

app.listen(port, host, function () {
  console.log(`Server listens http://${host}:${port}`);
});
