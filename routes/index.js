var express = require("express");
const passport = require("passport");

var router = express.Router();
var Recurso = require("../controller/recurso");

/* GET home page. */
router.get("/", function (req, res, next) {
  if (!req.isAuthenticated()) res.redirect("/login");
  else if( req.user.nivel == "produtor" ) res.redirect("/produtor/")
  else if( req.user.nivel == "consumidor" ) res.redirect("/consumidor/")
  else if( req.user.nivel == "administrador" ) res.redirect("/administrador/")
});

router.get("/logout", function (req, res, next) {
  req.logout();
  res.clearCookie("totallyNotALoginCookieKeepScrolling");
  req.session.destroy((err) => {
    if (!err) res.redirect("/");
    else console.log("Erro no Logout");
  });
});

router.get("/login", function (req, res, next) {
  console.log('\u001b[31m'+"----LOGIN PAGE----")
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    session : true
  }),
  (req,res,next)=>{
    if(req.isUnauthenticated()) {
      console.log('\u001b[31m'+"LOGIN FAILED")
      next();}
      else res.redirect("/")
      
  }
);

router.get("/about", function (req, res, next) {
  res.render("about");
});
router.get("/registar", function (req, res, next) {
  res.render("registar");
});

module.exports = router;
