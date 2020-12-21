var express = require("express");
var router = express.Router();
var Consumer = require("../controller/recurso");

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log("CB do Consumidor");
  res.render("Consumidor/index");
});

module.exports = router;
