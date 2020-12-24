var express = require("express");
var router = express.Router();
var Recursos = require("../controller/recurso");

/* GET home page. */
router.get("/", function (req, res, next) {
  Recursos.list()
    .then((dados) => res.render("Consumidor/index", { recursos: dados }))
    .catch((e) => res.render("error", { error: e }));
});

router.get(/\/recurso\/[0-9a-zA-Z]*/, function (req, res, next) {
  var split = req.url.split("/")[2];
  console.log(split);
  Recursos.lookUp(split)
    .then((dados) => res.render("Consumidor/recurso", { recurso: dados }))
    .catch((e) => res.render("error", { error: e }));
});

module.exports = router;
