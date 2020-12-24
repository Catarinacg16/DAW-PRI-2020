var express = require("express");
const passport = require("passport");
var router = express.Router();
var Recursos = require("../controller/recurso");

/* GET home page. */
router.get("/",function (req, res, next) {
  Recursos.list()
    .then((dados) => res.render("Produtor/index", { recursos: dados }))
    .catch((e) => res.render("error", { error: e }));
});

module.exports = router;
