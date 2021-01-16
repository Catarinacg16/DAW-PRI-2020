var express = require("express");
var router = express.Router();
var Recursos = require("../controller/recurso");


/* GET home page. */
router.get("/", function (req, res, next) {
  Recursos.list()
    .then((dados) => res.render("Consumidor/index", { recursos: dados }))
    .catch((e) => res.render("error", { error: e }));
});

router.post('/recurso/:id', (req, res) =>{

  req.body.data=new Date().toISOString().substr(0, 16)
  req.body.id_coment=Recursos.list().length
  Recursos.lookUp(req.params.id).then((dados) => {
    dados.comentarios.push(req.body)
    console.log(dados.comentarios)
    Recursos.edit(req.params.id,dados)
      .then((e) => res.redirect('/consumidor/recurso/'+req.params.id))
      .catch((e) => res.render("error", { error: e }));
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get(/\/recurso\/[0-9a-zA-Z]*/, function (req, res, next) {
  var split = req.url.split("/")[2];
  //console.log(split);
  Recursos.lookUp(split)
    .then((dados) => res.render("Consumidor/recurso", { recurso: dados }))
    .catch((e) => res.render("error", { error: e }));
});

module.exports = router;

router.get('/download/:filename', (req, res) => {
  res.download( __dirname + '/../public/fileStore/' + req.params.filename)
})

