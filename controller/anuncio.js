// Utilizador controller

var mongoose = require("mongoose");
var Anuncio = require("../model/anuncio");

// Retorna lista de utilizadores
module.exports.list = function () {
  return Anuncio.find().exec();
};

// Retorna um Utilizador
module.exports.lookUp = function (u) {
  return Anuncio.findOne({ _id: u }).exec();
};

// Remove um recurso
module.exports.remove = function (id) {
  return Anuncio.deleteOne({ _id: id });
};

// Edita um recurso
module.exports.edit = function (id, r) {
  return Anuncio.findByIdAndUpdate(id, r, { new: true });
};

// Insere um novo utilizador
module.exports.insert = function (u) {
  var novoAn = new Anuncio(u);
  return novoAn.save();
};

module.exports.desativaGeral = function (id) {
  this.list()
    .then((dados) => {
      dados.forEach((anun) => {
        if (anun._id != id) {
          anun.ativo = 0;
          this.edit(anun._id, anun)
            .then(console.log("atualizou"))
            .catch((e) => res.render("error", { error: e }));
        }
      });
    })
    .catch((e) => res.render("error", { error: e }));
};

module.exports.getAnuncio = function () {
  return Anuncio.findOne({ ativo: 1 }).exec();
};
