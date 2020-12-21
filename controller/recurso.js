// Recurso controller

var mongoose = require("mongoose");
var Recurso = require("../model/recurso");

// Retorna lista de recursos
module.exports.list = function () {
  return Recurso.find().exec();
};

// Retorna um recurso
module.exports.lookUp = function (r) {
  return Recurso.findOne(r).exec();
};

// Insere um novo recurso
module.exports.insert = function (r) {
  var novoRecurso = new Recurso(r);
  return novoRecurso.save();
};

// Remove um recurso
module.exports.remove = function (id) {
  return Recurso.deleteOne({ _id: id });
};

// Edita um recurso
module.exports.edit = function (id, r) {
  return Recurso.findByIdAndUpdate(id, r, { new: true });
};
