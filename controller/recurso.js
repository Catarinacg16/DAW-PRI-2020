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

//Retorna recursos inseridos por um determinado user
module.exports.lookUpByUser = function (id_user) {
  return Recurso.find({ produtor: id_user }).exec();
};

//Retorna comentario
module.exports.lookUpCom = function (com_id) {
  var rec = Recurso.list();
  return rec.map((i)  => JSON.parse(i)).find((c) => c.id_coment === com_id);

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

//Insere comentário num recurso
module.exports.insertCom = function (r, com) {
  return Recurso.findByIdAndUpdate(r, {$set: {"comentarios": com}}, {new: true});
};

// Remove um recurso
module.exports.remove = function (id) {
  return Recurso.deleteOne({ _id: id });
};

// Edita um recurso
module.exports.edit = function (id, r) {
  return Recurso.findByIdAndUpdate(id, r, { new: true });
};
