var express = require("express");
const Utilizador = require("../controller/utilizador");
var router = express.Router();
const Anuncios = require("../controller/anuncio");
const Recursos = require("../controller/recurso");
var multer = require("multer");

var upload = multer({ dest: "../uploads/" });
const { symlinkSync } = require("fs");

/* GET Form registar utilizador*/
router.get("/registar", function (req, res, next) {
  res.render("Administrador/registar");
});

/* POST Form registar utilizador*/
router.post("/registar", function (req, res, next) {
  var d = new Date().toISOString().substr(0, 16);
  req.body.dataRegisto = d;
  Utilizador.insert(req.body)
    .then((data) => res.redirect("/administrador"))
    .catch((e) => res.render("error", { error: e }));
});

/* POST Form registar anuncio*/
router.post("/anunciado", function (req, res, next) {
  console.log(req.body);
  var d = new Date().toISOString().substr(0, 16);
  req.body.dataCriacao = d;
  req.body.autor = req.user.email;
  req.body.ativo = 1;
  Anuncios.desativaGeral("1");
  Anuncios.insert(req.body)
    .then((data) => res.redirect("/administrador/anuncios"))
    .catch((e) => res.render("error", { error: e }));
});

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log("CB do Admin");
  res.render("Administrador/index");
});
module.exports = router;

router.get("/recursos", function (req, res, next) {
  Recursos.list()
    .then((dados) => {
      Utilizador.list()
        .then((prod) => {
          //console.log(prod);
          res.render("Administrador/recursos", {
            recursos: dados,
            produtores: prod,
          });
        })
        .catch((e) => res.render("error", { error: e }));
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/utilizadores", (req, res) => {
  Utilizador.list()
    .then((lista) => {
      res.render("Administrador/users", { users: lista });
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/anuncios", (req, res) => {
  Anuncios.list()
    .then((lista) => {
      res.render("Administrador/anuncios", { anuncios: lista });
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

router.post("/recurso/:id", (req, res) => {
  req.body.data = new Date().toISOString().substr(0, 16);

  Recursos.lookUp(req.params.id)
    .then((dados) => {
      req.body.id_coment = dados.comentarios.length + 1;
      req.body.id_utilizador = req.user.email;
      req.body.nome_utilizador = req.user.nome;
      dados.comentarios.push(req.body);
      //console.log(dados.comentarios);
      Recursos.edit(req.params.id, dados)
        .then((e) => res.redirect("/administrador/recurso/" + req.params.id))
        .catch((e) => res.render("error", { error: e }));
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/recurso/edit/:id", function (req, res) {
  Recursos.lookUp(req.params.id)
    .then((dados) => {
      Utilizador.lookUpId(dados.produtor)
        .then((prod) => {
          res.render("Administrador/editRecurso", {
            recursos: dados,
            produtor: prod,
          });
        })
        .catch((e) => res.render("error", { error: e }));
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/deleter/:id", function (req, res) {
  Recursos.remove(req.params.id)
    .then(() => {
      res.redirect("/administrador/recursos");
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/ativar/:id", function (req, res) {
  var id = req.params.id;
  Anuncios.lookUp(id)
    .then((anun) => {
      if (anun.ativo != 1) anun.ativo = 1;
      else anun.ativo = 0;
      Anuncios.desativaGeral(id);
      Anuncios.edit(id, anun)
        .then(() => {
          res.redirect("/administrador/anuncios");
        })
        .catch((e) => res.render("error", { error: e }));
    })

    .catch((e) => res.render("error", { error: e }));
});

router.get("/deletea/:id", function (req, res) {
  Anuncios.remove(req.params.id)
    .then(() => {
      res.redirect("/administrador/anuncios");
    })
    .catch((e) => res.render("error", { error: e }));
});

router.post("/editar/:id", upload.single("file"), function (req, res) {
  var id = req.params.id;
  Recursos.edit(id, req.body)
    .then(() => {
      res.redirect("/administrador/recursos");
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/profile/:id", (req, res) => {
  Utilizador.lookUpID(req.params.id)
    .then((prod) => {
      console.log(prod);
      Recursos.lookUpProd(prod.email)
        .then((recs) => {
          var ponto = Recursos.getPontuacaoMedia(recs);
          var downs = Recursos.getNumDownloads(recs);
          res.render("Administrador/profile", {
            produtor: prod,
            recursos: recs,
            pontuacao: ponto,
            downs: downs,
          });
        })
        .catch((e) => res.render("error", { error: e }));
    })

    .catch((e) => res.render("error", { error: e }));
});

router.get(/\/recurso\/[0-9a-zA-Z]*/, function (req, res, next) {
  var split = req.url.split("/")[2];
  console.log(split);
  Recursos.lookUp(split)
    .then((dados) => {
      Utilizador.lookUpId(dados.produtor)
        .then((resp) => {
          res.render("Administrador/recurso", {
            recurso: dados,
            produtor: resp,
          });
        })
        .catch((er) => res.render("error", { error: er }));
    })
    .catch((e) => res.render("error", { error: e }));
});
