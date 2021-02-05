var express = require("express");
const Utilizador = require("../controller/utilizador");
var router = express.Router();
const Recursos = require("../controller/recurso");

/* GET Form registar utilizador*/
router.get("/registar", function (req, res, next) {
  res.render("Administrador/registar");
});

/* POST Form registar utilizador*/
router.post("/registar", function (req, res, next) {
  Utilizador.insert(req.body)
    .then((data) => res.status(200).jsonp(data))
    .catch((e) => res.render("error", { error: e }));
});
/* GET home page. */
router.get("/", function (req, res, next) {
  console.log("CB do Admin");
  res.render("Administrador/index");
});
module.exports = router;

router.get("/utilizadores", (req, res) => {
  Utilizador.list()
    .then((lista) => {
      res.render("Administrador/users", { users: lista });
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
