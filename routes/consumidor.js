var express = require("express");
var router = express.Router();
var Recursos = require("../controller/recurso");
var User = require("../controller/utilizador");
var url = require("url");

const Anuncios = require("../controller/anuncio");
/* GET home page. */
router.get("/", function (req, res, next) {
  Recursos.list()
    .then((dados) => {
      Anuncios.getAnuncio()
        .then((an) => {
          //console.log(an);
          if (an == null) {
            var po = "Novo Recurso adicionado! ";
            Recursos.lookUpLast().then((rec) => {
              //console.log(rec);
              Recursos.listByDown()
                .then((top) => {
                  res.render("Consumidor/index", {
                    recursos: dados,
                    notif: po,
                    redi: rec[0],
                    topRec: top,
                    eu: req.user.email,
                  });
                })
                .catch((e) => res.render("error", { error: e }));
            });
          } else {
            Recursos.listByDown()
              .then((top) => {
                res.render("Consumidor/index", {
                  recursos: dados,
                  notif: an.anuncio,
                  topRec: top,
                  eu: req.user.email,
                });
              })
              .catch((e) => res.render("error", { error: e }));
          }
        })

        .catch((e) => res.render("error", { error: e }));
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
        .then((e) => res.redirect("/consumidor/recurso/" + req.params.id))
        .catch((e) => res.render("error", { error: e }));
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get(/\/recurso\/[0-9a-zA-Z]*/, function (req, res, next) {
  var split = req.url.split("/")[2];
  //console.log(split);
  Recursos.lookUp(split)
    .then((dados) => {
      User.lookUpId(dados.produtor)
        .then((resp) => {
          res.render("Consumidor/recurso", {
            recurso: dados,
            consumidor: resp,
          });
        })
        .catch((er) => res.render("error", { error: er }));
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/download/:filename", (req, res) => {
  res.download(__dirname + "/../public/fileStore/" + req.params.filename);
});

router.post("/recurso/:idRecurso/:idComentario", (req, res) => {
  //req.body.data=new Date().toISOString().substr(0, 16)

  Recursos.lookUp(req.params.idRecurso)
    .then((dados) => {
      req.body.id_coment =
        dados.comentarios.find(
          (item) => item.id_coment === parseInt(req.params.idComentario)
        ).comentarios.length + 100;
      req.body.id_utilizador = req.user.email;
      req.body.nome_utilizador = req.user.nome;
      dados.comentarios
        .find((item) => item.id_coment === parseInt(req.params.idComentario))
        .comentarios.push(req.body);
      console.log(
        dados.comentarios.find(
          (item) => item.id_coment === parseInt(req.params.idComentario)
        ).comentarios
      );
      Recursos.edit(req.params.idRecurso, dados)
        .then((e) =>
          res.redirect("/consumidor/recurso/" + req.params.idRecurso)
        )
        .catch((e) => res.render("error", { error: e }));
    })
    .catch((e) => res.render("error", { error: e }));

  res.redirect("/consumidor/recurso/" + req.params.idRecurso);
});

module.exports = router;

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
      .then((dados) => res.render("Consumidor/index", { recursos: dados }))
      .catch((e) => res.render("error", { error: e }));
  } else {
    Recursos.lookUpbyData(tag)
      .then((dados) => res.render("Consumidor/index", { recursos: dados }))
      .catch((e) => res.render("error", { error: e }));
  }
});

router.get("/download/:id", function (req, res) {
  var folderPath = __dirname + "/../public/fileStore/" + req.params.id + "/";
  fs.readdirSync(folderPath).forEach((file) => {
    Recursos.addDownload(req.params.id);
    res.download(folderPath + file);
  });
});

module.exports = router;
router.get("/logout", function (req, res, next) {
  req.logout();
  res.clearCookie("totallyNotALoginCookieKeepScrolling");
  req.session.destroy((err) => {
    if (!err) res.redirect("/");
    else console.log("Erro no Logout");
  });
});

router.get("/profile", (req, res) => {
  Recursos.lookUpProd(req.user.email)
    .then((recs) => {
      res.render("Consumidor/profile", {
        produtor: req.user,
      });
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/rating/:id/:star", (req, res) => {
  console.log("estrelas: " + req.params.star);
  Recursos.addRating(req.params.id, req.params.star);
  res.redirect("/consumidor/recurso/" + req.params.id);
});
