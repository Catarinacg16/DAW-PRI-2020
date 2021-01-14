// Recurso controller

var mongoose = require("mongoose");
var Recurso = require("../model/recurso");

// Retorna lista de recursos
module.exports.list = function () {
  return Recurso.find().exec();
};

// Retorna um recurso
module.exports.lookUp = function (id) {
  return Recurso.findOne({ _id: id }).exec();
};

module.exports.lookUpbyTag = function (taglist) {
  console.log("print taglist"+taglist)
  return Recurso.find({ tags: {$in : taglist} }).exec();
};

module.exports.lookUpbyData = function (data) {
    return Recurso.find({$or:[ { titulo: {$regex : ".*"+data+".*"} }, {descricao:  ".*"+data+".*"}]}).exec();
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
