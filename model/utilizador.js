//  Utilizador model
var mongoose = require('mongoose')

var utilizadorSchema = new mongoose.Schema({

    nome: String,
    email: String,
    filiacao: String,
    nivel: String,
    dataRegisto: Date,
    dataUltimoAcesso: Date,
    visibilidade: String,
    password: String
})

module.exports = mongoose.model('utilizador', utilizadorSchema)