var express = require("express");
const passport = require("passport");
var router = express.Router();
var Recursos = require("../controller/recurso");
var recurso = require("../model/recurso");
var User = require("../controller/utilizador");
var multer = require("multer");
var upload = multer({ dest: "../uploads/" });
var fs = require("fs");
var is_zip = require("is-zip-file");
var jsonfile = require("jsonfile");
var qs = require("query-string");
var url = require("url");
var { ingest } = require("./ingest");
const { Console } = require("console");
var { isAccessible,getUncompressedFromId, previewFacilitator} = require("./access");

const utilizador = require("../model/utilizador");

const Anuncios = require("../controller/anuncio");


/* GET home page. */
router.get("/", function (req, res, next) {
  Recursos.list()
    .then((dados) => {
      Anuncios.getAnuncio()
        .then((an) => {
          Recursos.listByDown()
            .then((top) => {
              res.render("Produtor/index", { recursos: dados, notif: an, topRec: top });
            })
            .catch((e) => res.render("error", { error: e }));
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
      User.lookUpId(dados.produtor)
        .then((resp) => {
          let ffp= previewFacilitator(dados._id);
          res.render("Produtor/recurso", { recurso: dados, produtor: resp, path:ffp});
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
  var newList = [];
  tag = tag.split("#");
  if (tag.length > 1) {
    tag = tag.slice(1);

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

  Recursos.lookUpbyTag(newList)
    .then((dados) => {
      Recursos.listByDown()
            .then((top) => {res.render("Produtor/index", { recursos: dados, topRec:top })})
            .catch((e) => res.render("error", { error: e }));
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/editar/:id", function (req, res) {
  Recursos.lookUp(req.params.id)
    .then((dados) => {
      res.render("Produtor/editRecurso", {
        recursos: dados,
        produtor: req.user,
      });
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/remove/:id", function (req, res) {
  Recursos.remove(req.params.id)

  .then(() => {   
    res.redirect("/produtor/profile");
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
  var id = req.params.id;
  Recursos.edit(id, req.body)

    .then(() => {   
      res.redirect("/produtor/profile");

    })
    .catch((e) => res.render("error", { error: e }));
});

router.post("/upload", upload.single("file"), function (req, res) {
  var ret = ingest(req.file, req);
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
    is_zip.isZip(folderPath + file, function (err, is) {
      if (err) {
        console.log("Error while checking if file is zip : " + err);
      } else {
        console.log(file);
      }
    });
  });
  var ret = isAccessible(folderPath);
  if (ret == false) {
    console.log("Ficheiro Corrompido");
  } else {
    Recursos.addDownload(req.params.id);
    res.download(ret);
  }
});

router.get("/profile", (req, res) => {
  var pathAvatar = "/fileStore/avatares/"+req.user._id;
  try {
    if (!fs.existsSync( __dirname + "/../public" + pathAvatar)) {
      pathAvatar="/images/user.png"
    }
  } catch(err) {
    console.error(err)
  }
  Recursos.lookUpProd(req.user.email)
    .then((recs) => {
      var ponto = Recursos.getPontuacaoMedia(recs);
      var downs = Recursos.getNumDownloads(recs);
      res.render("Produtor/profile", {
        produtor: req.user,
        recursos: recs,
        pontuacao: ponto,
        downs: downs,
        path: pathAvatar
      });
    })
    .catch((e) => res.render("error", { error: e }));
});

router.get("/editarProfile/",upload.single("file"),(req, res) => {
  console.log(req.user._id)
  var pathAvatar = "/fileStore/avatares/"+req.user._id;
  try {
    if (!fs.existsSync( __dirname + "/../public"+ pathAvatar)) {
      pathAvatar="/images/user.png"
    }
  } catch(err) {
    console.error(err)
  }
  User.lookUpID(req.user._id)
    .then((dados) => {
      res.render("Produtor/editProfile", { user: dados, path:pathAvatar})
    })
    .catch((e) => res.render("error", { error: e }));
});

router.post("/editarPerfil/",upload.single('file'),(req, res) => {
  
  if(req.file!=null){
    let oldPath = __dirname + '/../' + req.file.path;
    let newPath = __dirname + '/../public/fileStore/avatares/' + req.user._id
    console.log(oldPath + "   "+ newPath)
    fs.rename(oldPath, newPath, function(err) {
      if(err) {
          res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'})
          res.write('<p> Erro: ao mover o ficheiro da quarentena...</p>')
          res.end()
      }
      else{
        if ((req.body.password == req.body.password2 && !(req.body.password==undefined) )|| req.body.password==undefined){
          console.log(req.body)
          delete req.body.password2;
          console.log(req.body)
          
          User.editP(req.user._id, req.body)
            .then(() => {   
              res.redirect("/produtor/profile");
            })
            .catch((e) => res.render("error", { error: e }));
            
        }
      }
    })
  }else{
    if ((req.body.password == req.body.password2 && !(req.body.password==undefined) )|| req.body.password==undefined){
      console.log(req.body)
      delete req.body.password2;
      console.log(req.body)
      
      User.editP(req.user._id, req.body)
        .then(() => {   
          res.redirect("/produtor/profile");
        })
        .catch((e) => res.render("error", { error: e }));
        
    }
  }
  

    
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
