//  Recurso model
var mongoose = require("mongoose");

var comentarios = new mongoose.Schema({
  id_Utilizador: Number,
  nome_utilizador: String,
  data_comentario: Date,
  destricao: String,
});

comentarios.add({ comentarios: [comentarios] }); //replies do proprio comentario (tem que ser aqui senao morre)

var recursoSchema = new mongoose.Schema({
  tipo: String,
  descricao: String,
  titulo: String,
  dataCriacao: Date,
  dataRegisto: Date,
  visibilidade: String,
  autor: [String],
  produtor: String,
  pontuacao: Number,
  numPontuacoes: Number,
  comentarios: [comentarios], //replies
  tags: [String],
});

module.exports = mongoose.model("recurso", recursoSchema);
