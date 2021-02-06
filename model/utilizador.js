//  Utilizador model
var mongoose = require("mongoose");

var utilizadorSchema = new mongoose.Schema({
  nome: String,
  email: String,
  filiacao: String,
  nivel: String,
  dataRegisto: Date,
  dataUltimoAcesso: Date,
  password: String,
});

module.exports = mongoose.model("utilizadore", utilizadorSchema);
