var express = require("express");
const passport = require("passport");
var router = express.Router();
var Recursos = require("../controller/recurso");
var multer = require('multer');
var upload = multer({ dest: '../uploads/' })
var fs = require('fs')
var jsonfile = require('jsonfile')
var qs = require('query-string');
var url = require('url');

/* GET home page. */
router.get("/", function (req, res, next) {
  Recursos.list()
    .then((dados) => res.render("Produtor/index", { recursos: dados }))
    .catch((e) => res.render("error", { error: e }));
});

router.get(/\/recurso\/[0-9a-zA-Z]*/, function (req, res, next) {
  var split = req.url.split("/")[2];
  console.log(split);
  Recursos.lookUp(split)
    .then((dados) => res.render("Produtor/recurso", { recurso: dados }))
    .catch((e) => res.render("error", { error: e }));
});

module.exports = router;


router.get('/resultados', function (req, res) {
  var queryObject = url.parse(req.url, true).query;
  var tag = queryObject.search;
  //remove espaços em branco
  tag=tag.replace(/\s+/g, '');  
  //separa tags
  
  tag = tag.split("#")
  console.log(tag)
  if(tag.length>1){
    Recursos.lookUpbyTag(tag)
      .then((dados) => res.render("Produtor/index", { recursos: dados }))
      .catch((e) => res.render("error", { error: e }));
  }
  else {
    Recursos.lookUpbyData(tag)
      .then((dados) => res.render("Produtor/index", { recursos: dados }))
      .catch((e) => res.render("error", { error: e }));
  }
});

router.get("/upload", function (req, res) {
  res.render("Produtor/upload")
  res.end()
})

router.post('/upload', upload.array('file'), function (req, res) {

  req.files.forEach((f, idx) => {
    console.log(f.path)
    let oldPath = f.path
    let newPath = __dirname + '/../public/fileStore/' + req.body.

    fs.rename(oldPath, newPath, function (err) {
      if (err) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.write('<p> Erro: ao mover o ficheiro ...</p>')
        res.end()
      }
      else {
        var d = new Date().toISOString().substr(0, 16)
        req.body.dataRegisto=d
        req.body.tags= [req.body.titulo, req.body.descricao]
        req.body.autor.forEach((a) => {
          req.body.tags.push(a)
        })
        Recursos.insert(req.body)
      }
    })

  })
  res.redirect('/produtor')
})

router.get('/download/:filename', (req, res) => {
  res.download( __dirname + '/../public/fileStore/' + req.params.filename)
})