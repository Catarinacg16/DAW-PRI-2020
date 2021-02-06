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
