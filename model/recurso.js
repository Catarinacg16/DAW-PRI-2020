//  Recurso model
var mongoose = require('mongoose')

var recursoSchema = new mongoose.Schema({
    tipo: String,
    descricao: String,
    titulo: String,
    dataCriacao: Date,
    dataRegisto: Date,
    visibilidade: String,
    autor: [String],
    produtor: String
})

module.exports = mongoose.model('recurso', recursoSchema)