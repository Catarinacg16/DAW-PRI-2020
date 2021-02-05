var express = require("express");
const passport = require("passport");
var router = express.Router();
var Recursos = require("../controller/recurso");
var User = require("../controller/utilizador");
var multer = require("multer");
var upload = multer({ dest: "../uploads/" });
var fs = require("fs");
var is_zip = require('is-zip-file');
var jsonfile = require("jsonfile");
var qs = require("query-string");
var url = require("url");
var { ingest } = require("./ingest");
const { Console } = require("console");

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
    .then((dados) => {
      User.lookUpId(dados.produtor)
        .then((resp) => {
          res.render("Produtor/recurso", { recurso: dados, produtor: resp });
        })
        .catch((er) => res.render("error", { error: er }));
    })
    .catch((e) => res.render("error", { error: e }));
});

router.post("/recurso/:id", (req, res) => {
  req.body.data = new Date().toISOString().substr(0, 16);

  Recursos.lookUp(req.params.id)
    .then((dados) => {
      req.body.id_coment = dados.comentarios.length + 1;
      req.body.id_utilizador = req.user.email;
      req.body.nome_utilizador = req.user.nome;
      dados.comentarios.push(req.body);
      console.log(dados.comentarios);
      Recursos.edit(req.params.id, dados)
        .then((e) => res.redirect("/produtor/recurso/" + req.params.id))
        .catch((e) => res.render("error", { error: e }));
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/resultados", function (req, res) {
  var queryObject = url.parse(req.url, true).query;
  var tag = queryObject.search;
  //remove espaços em branco
  tag = tag.replace(/\s+/g, "");
  //separa tags

  tag = tag.split("#");
  console.log(tag);
  if (tag.length > 1) {
    Recursos.lookUpbyTag(tag)
      .then((dados) => res.render("Produtor/index", { recursos: dados }))
      .catch((e) => res.render("error", { error: e }));
  } else {
    Recursos.lookUpbyData(tag)
      .then((dados) => res.render("Produtor/index", { recursos: dados }))
      .catch((e) => res.render("error", { error: e }));
  }
});

router.get("/meusUploads", function (req, res) {
  var user = req.user.email;
  Recursos.lookUpByUser(user)
    .then((dados) => {
      res.render("Produtor/meusUploads", { recursos: dados }),
        console.log(dados);
    })
    .catch((e) => res.render("error", { error: e }));
});
router.get("/editar/:id", function (req, res) {
  Recursos.lookUp(req.params.id)
    .then((dados) => {
      res.render("Produtor/editRecurso", { recursos: dados, produtor: req.user})
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/upload", function (req, res) {
  var user = req.user.email;
  console.log(user);
  Recursos.lookUpByUser(user)
    .then((dados) => {
      res.render("Produtor/upload", { recursos: dados }), console.log(dados);
    })
    .catch((e) => res.render("error", { error: e }));
});

router.post("/editar/:id", upload.single("file"), function (req, res) {
  var id =req.params.id;
  Recursos.edit(id, req.body)
    .then(() => {
      var user = req.user.email;
      Recursos.lookUpByUser(user)
        .then((dados) => {
          res.render("Produtor/meusUploads", { recursos: dados })
        })
        .catch((e) => res.render("error", { error: e }))
    .catch((e) => res.render("error", { error: e }));
    })
});


router.post("/upload", upload.single("file"), function (req, res) {
    var ret = ingest(f, req);
    if (ret == true) res.redirect("/produtor");
    else res.jsonp(ret);
  });

/*
router.post("/upload", upload.array("file"), function (req, res) {
  req.files.forEach((f, idx) => {
    console.log(f.path);
    let oldPath = f.path;
    let newPath = __dirname + '/../public/fileStore/' + req.body.titulo;
    console.log(newPath);
    fs.rename(oldPath, newPath, function (err) {
        if (err) {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.write("<p> Erro: ao mover o ficheiro ...</p>");
          res.end();
        } else {
          var d = new Date().toISOString().substr(0, 16);
          req.body.dataRegisto = d;
          console.log (req.body);
          Recursos.insert(req.body);
        }
      });
  });
  res.redirect("/produtor");
});
*/
module.exports = router;
router.get("/download/:id", function (req, res) {
  var folderPath = __dirname + "/../public/fileStore/" + req.params.id + "/";
  fs.readdirSync(folderPath).forEach((file) => {
    is_zip.isZip(folderPath + file, function(err, is) {
      if(err) {
        console.log('Error while checking if file is zip : ' + err);
      }
      else {
        console.log(file)
        Recursos.addDownload(req.params.id);
        res.download(folderPath + file);
     }
    })
  });
});

router.get("/profile", (req, res) => {
  Recursos.lookUpProd(req.user.email)
    .then((recs) => {
      var ponto = Recursos.getPontuacaoMedia(recs);
      var downs = Recursos.getNumDownloads(recs);
      res.render("Produtor/profile", {
        produtor: req.user,
        recursos: recs,
        pontuacao: ponto,
        downs: downs,
      });
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/logout", function (req, res, next) {
  req.logout();
  res.clearCookie("totallyNotALoginCookieKeepScrolling");
  req.session.destroy((err) => {
    if (!err) res.redirect("/");
    else console.log("Erro no Logout");
  });
});

router.get("/rating/:id/:star", (req, res) => {
  console.log("estrelas: " + req.params.star);
  Recursos.addRating(req.params.id, req.params.star);
  res.redirect("/produtor/recurso/" + req.params.id);
});
