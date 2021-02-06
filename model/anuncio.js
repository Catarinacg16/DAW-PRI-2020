//  Anuncio model
var mongoose = require("mongoose");

var anuncioSchema = new mongoose.Schema({
  autor: String,
  dataCriacao: Date,
  ativo: Number,
  anuncio: String,
});

module.exports = mongoose.model("anuncio", anuncioSchema);
