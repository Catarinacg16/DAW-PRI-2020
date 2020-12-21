var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('CB da HomePage maybe futuro login')
  res.render('index');
});

module.exports = router;
