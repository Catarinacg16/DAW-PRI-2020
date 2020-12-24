// Utilizador controller

var mongoose = require("mongoose");
var Utilizador = require("../model/utilizador");

// Retorna lista de utilizadores
module.exports.list = function () {
  return Utilizador.find().exec();
};

// Retorna um Utilizador
module.exports.lookUp = function (u) {
  console.log("UserController: ")
  return Utilizador.findOne(u).exec();

};

// Insere um novo utilizador
module.exports.insert = function (u) {
  var novoUtilizador = new Utilizador(u);
  return novoUtilizador.save();
};

// Remove um utilizador
module.exports.remove = function (id) {
  return Utilizador.deleteOne({ _id: id });
};

// Edita um utilizador
module.exports.edit = function (id, u) {
  return Utilizador.findByIdAndUpdate(id, u, { new: true });
};
