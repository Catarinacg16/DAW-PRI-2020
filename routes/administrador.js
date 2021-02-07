var express = require("express");
const Utilizador = require("../controller/utilizador");
var router = express.Router();
const Anuncios = require("../controller/anuncio");
const Recursos = require("../controller/recurso");
var multer = require("multer");
var upload = multer({ dest: "../uploads/" });
var fs = require("fs");
var { ingest } = require("./ingest");
var {
  isAccessible,
  getUncompressedFromId,
  previewFacilitator,
} = require("./access");

const { symlinkSync } = require("fs");

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

router.get("/deleteu/:id", function (req, res) {
  Utilizador.remove(req.params.id)
    .then(() => {
      res.redirect("/administrador/utilizadores");
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/deletec/:re/:id", function (req, res) {
  Recursos.removeCom(req.params.re, req.params.id)
    .then(() => {
      res.redirect("/administrador/recurso/" + req.params.re);
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
      var ponto = Recursos.getPontuacaoMedia(recs);
      var downs = Recursos.getNumDownloads(recs);
      res.render("Administrador/profile", {
        produtor: req.user,
        recursos: recs,
        pontuacao: ponto,
        downs: downs,
        path: pathAvatar,
      });
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/profile/:id", (req, res) => {
  Utilizador.lookUpID(req.params.id)
    .then((prod) => {
      console.log(prod);
      Recursos.lookUpProd(prod.email)
        .then((recs) => {
          var pathAvatar = "/fileStore/avatares/" + prod._id;
          console.log(pathAvatar);
          try {
            if (!fs.existsSync(__dirname + "/../public" + pathAvatar)) {
              pathAvatar = "/images/user.png";
            }
          } catch (err) {
            console.error(err);
          }

          var ponto = Recursos.getPontuacaoMedia(recs);
          var downs = Recursos.getNumDownloads(recs);
          res.render("Administrador/profile", {
            produtor: prod,
            recursos: recs,
            pontuacao: ponto,
            downs: downs,
            avatar: pathAvatar,
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
          var pathAvatar = "/fileStore/avatares/" + resp._id;
          console.log(pathAvatar);
          try {
            if (!fs.existsSync(__dirname + "/../public" + pathAvatar)) {
              pathAvatar = "/images/user.png";
            }
          } catch (err) {
            console.error(err);
          }

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

router.get("/editProfile/:id", upload.single("file"), (req, res) => {
  var id = req.params.id;
  var pathAvatar = "/fileStore/avatares/" + id;
  try {
    if (!fs.existsSync(__dirname + "/../public" + pathAvatar)) {
      pathAvatar = "/images/user.png";
    }
  } catch (err) {
    console.error(err);
  }
  Utilizador.lookUpID(id)
    .then((dados) => {
      res.render("Administrador/editProfile", {
        user: dados,
        avatar: pathAvatar,
      });
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/upload", function (req, res) {
  var user = req.user.email;
  console.log(user);
  Recursos.lookUpByUser(user)
    .then((dados) => {
      res.render("Administrador/upload", { recursos: dados });
      //console.log(dados);
    })
    .catch((e) => res.render("error", { error: e }));
});

router.post("/upload", upload.single("file"), function (req, res) {
  req.body.pontuacao = 0;
  req.body.numPontuacoes = 0;
  req.body.numDowns = 0;
  var ret = ingest(req.file, req);
  if (ret == true) res.redirect("/administrador/recursos");
  else res.jsonp(ret);
});

router.post("/editPerfil/:id", upload.single("file"), (req, res) => {
  var id = req.params.id;
  if (req.file != null) {
    let oldPath = __dirname + "/../" + req.file.path;
    let newPath = __dirname + "/../public/fileStore/avatares/" + id;
    console.log(oldPath + "   " + newPath);
    fs.rename(oldPath, newPath, function (err) {
      if (err) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write("<p> Erro: ao mover o ficheiro da quarentena...</p>");
        res.end();
      } else {
        if (
          (req.body.password == req.body.password2 &&
            !(req.body.password == undefined)) ||
          req.body.password == undefined
        ) {
          console.log(req.body);
          delete req.body.password2;
          console.log(req.body);

          Utilizador.editP(id, req.body)
            .then(() => {
              res.redirect("/administrador/utilizadores");
            })
            .catch((e) => res.render("error", { error: e }));
        }
      }
    });
  } else {
    if (
      (req.body.password == req.body.password2 &&
        !(req.body.password == undefined)) ||
      req.body.password == undefined
    ) {
      console.log(req.body);
      delete req.body.password2;
      console.log(req.body);

      Utilizador.editP(id, req.body)
        .then(() => {
          res.redirect("/administrador/utilizadores");
        })
        .catch((e) => res.render("error", { error: e }));
    }
  }
});

router.get("/resultadosRec", function (req, res) {
  var queryObject = url.parse(req.url, true).query;
  var titulo = queryObject.search;
  console.log(titulo);
  Recursos.lookUpByTitulo(titulo)
    .then((dados) => {
      Utilizador.list()
        .then((prod) => {
          console.log(dados);
          res.render("Administrador/recursos", {
            recursos: dados,
            produtores: prod,
          });
        })
        .catch((e) => res.render("error", { error: e }));
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/resultadosUser", function (req, res) {
  var queryObject = url.parse(req.url, true).query;
  var nome = queryObject.search;
  console.log(nome);
  Utilizador.lookUpByNome(nome)
    .then((lista) => {
      res.render("Administrador/users", { users: lista });
    })
    .catch((e) => res.render("error", { error: e }));
});
