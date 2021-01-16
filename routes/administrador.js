var express = require('express');
const Utilizador = require('../controller/utilizador');
var router = express.Router();

/* GET Form registar utilizador*/
router.get('/registar', function(req, res, next) {
  res.render('Administrador/registar');
});

/* POST Form registar utilizador*/
router.post('/registar', function(req, res, next) {
  Utilizador.insert(req.body)
  .then(data=>res.status(200).jsonp(data))
  .catch(e=>res.render("error",{error : e}))
});
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('CB do Admin')
  res.render('Administrador/index');
});
module.exports = router;
