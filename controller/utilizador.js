// Utilizador controller

var mongoose = require("mongoose");
var Utilizador = require("../model/utilizador");

// Retorna lista de utilizadores
module.exports.list = function () {
  return Utilizador.find().exec();
};

// Retorna um Utilizador
module.exports.lookUp = function (u) {
  return Utilizador.findOne(u).exec();
};

// Retorna um Utilizador por id
module.exports.lookUpId = function (u) {
  return Utilizador.findOne({ email: u }).exec();
};

// Retorna um Utilizador por id
module.exports.lookUpID = function (u) {
  return Utilizador.findOne({ _id: u }).exec();
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

module.exports.editP = function (id, b) {
  if(b.password!=null){
    return Utilizador.updateOne(
      {_id: id},
      {
        $set : {nome: b.nome},
        $set :{filiacao: b.filiacao},
        $set :{password: b.password}
      }
    );
  }
  else {
    return Utilizador.updateOne(
      {_id: id},
      {
        $set : {nome: b.nome},
        $set :{filiacao: b.filiacao},
      }
    );
  }
};

module.exports.lookUpByNome = function (n) {
  return Utilizador.find({ 
    $or: [
      { nome: n },
      { email: n}
    ]}).exec();
};