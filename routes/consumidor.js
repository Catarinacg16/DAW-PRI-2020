var express = require("express");
var router = express.Router();
var Recursos = require("../controller/recurso");
var User = require("../controller/utilizador");
var url = require("url");
var {
  isAccessible,
  getUncompressedFromId,
  previewFacilitator,
} = require("./access");

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

//Adiciona Reply a um comentario
router.post("/recurso/:rec/:com", (req, res) => {
  req.body.data = new Date().toISOString().substr(0, 16);
  console.log("Passei por aqui");
  req.body.id_utilizador = req.user.email;
  req.body.nome_utilizador = req.user.nome;
  Recursos.list()
    .then((recursos) => {
      var result = Recursos.getNumComs(recursos);
      req.body.id_coment = result;
      Recursos.addReply(
        req.params.rec,
        req.params.com,
        JSON.stringify(req.body)
      )
        .then(() => {
          res.redirect("/produtor/recurso/" + req.params.rec);
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
  var pathAvatar = "/fileStore/avatares/" + req.user._id;
  try {
    if (!fs.existsSync(__dirname + "/../public" + pathAvatar)) {
      pathAvatar = "/images/user.png";
    }
  } catch (err) {
    console.error(err);
  }
  var split = req.url.split("/")[2];
  console.log(split);
  Recursos.lookUp(split)
    .then((dados) => {
      User.lookUpId(dados.produtor)
        .then((resp) => {
          let ffp = previewFacilitator(dados._id);
          res.render("Produtor/recurso", {
            recurso: dados,
            produtor: resp,
            path: ffp,
            avatar: pathAvatar,
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
  var oldtag = queryObject.search;
  var newList = [];
  var tag = oldtag.split("#");

  if (tag.length > 1) {
    if (oldtag.charAt(0) == "#") tag = tag.slice(1);

    tag.forEach((str) => {
      var n = str.length;
      if (str.charAt(n - 1) == " ") {
        str = str.substring(0, str.length - 1);
      }
      if (str.includes(" ")) {
        newList.push(str.substr(0, str.indexOf(" ")));
        newList.push(str.substr(str.indexOf(" ") + 1));
      } else newList.push(str);
    });
  } else newList.push(tag);
  //console.log("newloisrt" +newList);

  Recursos.lookUpbyTag(newList)
    .then((dados) => {
      Recursos.listByDown()
        .then((top) => {
          res.render("Consumidor/index", { recursos: dados, topRec: top });
        })
        .catch((e) => res.render("error", { error: e }));
    })
    .catch((e) => res.render("error", { error: e }));
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
  var pathAvatar = "/fileStore/avatares/" + req.user._id;
  try {
    if (!fs.existsSync(__dirname + "/../public" + pathAvatar)) {
      pathAvatar = "/images/user.png";
    }
  } catch (err) {
    console.error(err);
  }
  Recursos.lookUpProd(req.user.email)
    .then((recs) => {
      res.render("Consumidor/profile", {
        produtor: req.user,
        avatar: pathAvatar,
      });
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/rating/:id/:star", (req, res) => {
  console.log("estrelas: " + req.params.star);
  Recursos.addRating(req.params.id, req.params.star);
  res.redirect("/consumidor/recurso/" + req.params.id);
});
