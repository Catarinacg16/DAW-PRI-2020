var express = require("express");
const passport = require("passport");

var router = express.Router();
var Recurso = require("../controller/recurso");

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log(" / isAuth? " + req.isAuthenticated());
  if (!req.isAuthenticated()) res.redirect("/login");
  else res.render("index");
});

router.get("/logout", function (req, res, next) {
  req.logout();
  req.session.destroy((err) => {
    if (!err) res.redirect("/");
    else console.log("Erro no Logout");
  });
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

module.exports = router;
