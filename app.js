var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var { v4: uuid } = require("uuid");

var session = require("express-session");
var FileStore = require("session-file-store")(session);
//var cors = require('cors');

var mongoDB = "mongodb://127.0.0.1/DAW-PRI-2020";
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

var db = mongoose.connection;
db.on("error", function () {
  console.log("Error connecting MongoDB...");
});
db.once("open", function () {
  console.log("Connected to MongoDB...");
});

var Utilizador = require("./controller/utilizador");

var indexRouter = require("./routes/index");
var adminRouter = require("./routes/administrador");
var consumidorRouter = require("./routes/consumidor");
var produtorRouter = require("./routes/produtor");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    function (email, password, done) {
      Utilizador.lookUp({ email: email })
        .then((user) => {
          if (!user) return done(null, false, { message: "User inexistente" });
          if (password != user.password)
            return done(null, false, { message: "Pass Errada" });
          return done(null, user);
        })
        .catch((erro) => done(erro));
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializar o user na sessao: " + JSON.stringify(user));
  done(null, user.id);
});

passport.deserializeUser((uid, done) => {
  console.log("A desserialiazar o user: " + uid);
  Utilizador.lookUp({ _id: uid })
    .then((dados) => done(null, dados))
    .catch((erro) => {
      console.log("RIP desserialize");
      done(erro, false);
    });
});

var app = express();
app.use(logger("dev"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
  session({
    genid: function (req) {
      return uuid();
    },
    store: new FileStore(),
    secret: "DAW-PRI-2020",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);

app.use(function (req, res, next) {
  console.log("SessId: " + req.sessionID);
  if (req.user) {
    console.log("mddlware IsLoggedIn? :" + req.user.id);
    next();
  } else res.render("login");
});

app.use("/Produtor", produtorRouter);
app.use("/Consumidor", consumidorRouter);
app.use("/Administrador", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
