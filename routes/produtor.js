var express = require("express");
const passport = require("passport");
var router = express.Router();
var Recursos = require("../controller/recurso");
var multer  = require('multer');
var upload = multer({ dest: '../uploads/' }) 
var fs = require('fs')
var jsonfile = require('jsonfile')

/* GET home page. */
router.get("/",function (req, res, next) {
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

router.get("/upload", function (req, res) {
  res.render("Produtor/upload")
  res.end()
})

router.post('/upload', upload.array('file'), function (req, res) {
    
  req.files.forEach((f,idx) => {
    console.log(f.path)
  let oldPath =   f.path
  let newPath = __dirname + '/../public/fileStore/' + f.originalname

  fs.rename(oldPath, newPath, function (err) {
      if (err) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
          res.write('<p> Erro: ao mover o ficheiro ...</p>')
          res.end()
      }
      else {
          var d = new Date().toISOString().substr(0, 16)
          var upfiles = jsonfile.readFileSync('./recursos.json')
          var n = req.files.length
              if(n > 1){
                  upfiles.push({
                      tipo: f.tipo,
                      descrição: f.desc,
                      titulo: f.tit,
                      dataCriacao: f.dc,
                      dataRegisto: d,
                      visibilidade:f.vi,
                      autor: f.autor,
                      produtor: "tania@gmail.com",
                      mimetype: f.mimetype,

                  })
              }
              else if (n==1){
                  upfiles.push({
                    tipo: req.body.tipo,
                    descrição: req.body.desc,
                    titulo: req.body.tit,
                    dataCriacao: req.body.dc,
                    dataRegisto: d,
                    visibilidade:req.body.vi,
                    autor: req.body.autor,
                    produtor: "tania@gmail.com",
                    mimetype: f.mimetype
                  })
              }
              jsonfile.writeFileSync('./recursos.json', upfiles)
          
          }
      
 
      })

  })
  res.redirect('/produtor')
})