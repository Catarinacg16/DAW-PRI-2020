// Recurso controller

var mongoose = require("mongoose");
var Recurso = require("../model/recurso");

// Retorna lista de recursos
module.exports.list = function () {
  return Recurso.find().exec();
};
// Retorna lista de recursos
module.exports.listByDown = function () {
  return Recurso.find().sort({ numDowns: -1 }).limit(5).exec();
};

// Retorna um recurso
module.exports.lookUp = function (id) {
  return Recurso.findOne({ _id: id }).exec();
};

//Retorna recursos inseridos por um determinado user
module.exports.lookUpByUser = function (id_user) {
  return Recurso.find({ produtor: id_user }).exec();
};

//retorna recursos de um produtor
module.exports.lookUpProd = function (email) {
  return Recurso.find({ produtor: email }).exec();
};

//Retorna comentario

module.exports.lookUpCom = function (com_id ) {

  return Recurso.findOne(
    {"comentarios.id_coment": com_id}, {comentarios: 1}
  )

}



module.exports.lookUpbyTag = function (taglist) {
  console.log(taglist + " " + taglist.length + "\n");
  return Recurso.find({
    $or: [
      { tags: { $in: taglist } },
      { autor: { $in: taglist } },
      { titulo: { $in: taglist } },
    ],
  }).exec();
};

module.exports.addDownload = function (id) {
  Recurso.findOne({ _id: id }, { numDowns: 1 })
    .exec()
    .then((nums) => {
      let nu = nums["numDowns"];
      nu = nu + 1;
      return Recurso.findOneAndUpdate({ _id: id }, { $set: { numDowns: nu } });
    })
    .catch((e) => res.render("error", { error: e }));
};

module.exports.addRating = function (id, rating) {
  Recurso.findOne({ _id: id }, { pontuacao: 1, numPontuacoes: 1 })
    .exec()
    .then((nums) => {
      var pontuacao = nums["pontuacao"];
      var numPont = nums["numPontuacoes"];

      var novPontuacao = parseFloat(pontuacao * numPont);
      numPont = numPont + 1;
      novPontuacao = novPontuacao + parseFloat(rating);

      novPontuacao = novPontuacao / numPont;
      Recurso.findOneAndUpdate(
        { _id: id },
        { $set: { pontuacao: novPontuacao } }
      )
        .exec()
        .then((o) => {
          Recurso.findOneAndUpdate(
            { _id: id },
            { $set: { numPontuacoes: numPont } }
          )
            .exec()
            .then((t) => {
              return 0;
            })
            .catch((e) => console.log("erro no update de numPontuacoes"));
        })
        .catch((e) => console.log("erro no update de Pontuacao"));
    })
    .catch((e) => console.log("erro no get de pontucao e numPontuacoes"));
};

module.exports.lookUpbyData = function (data) {
  return Recurso.find({
    $or: [
      //{ titulo: { $regex: ".*" + data + ".*" } },
      { titulo: "Testes" },
      { descricao: "Testes" },
    ],
  }).exec();
};

// Insere um novo recurso
module.exports.insert = function (r) {
  var novoRecurso = new Recurso(r);
  console.log(novoRecurso);
  return novoRecurso.save();
};

//devolve a pontuação média de recursos
module.exports.getPontuacaoMedia = function (recursos) {
  var ponto = 0;
  var total = 0;
  recursos.forEach((element) => {
    ponto = ponto + parseInt(element["pontuacao"]);
    total = total + 1;
  });
  ponto = ponto / total;
  return ponto;
};

//devolve numero de downsloads
module.exports.getNumDownloads = function (recursos) {
  var total = 0;
  recursos.forEach((element) => {
    total = total + parseInt(element["numDowns"]);
  });
  return total;
};

//devolve numero de comentarios + replies
module.exports.getNumComs = function (recursos) {
  var total = 0;
  recursos.forEach((element) => {
    if (element["comentarios"].length > 0) {
      total = total + 1;
      total = total + parseInt(element["comentarios"].length);
    }
  });
  total = total + 1;
  return total;
};

//Insere comentário num recurso
module.exports.insertCom = function (r, com) {
  return Recurso.findByIdAndUpdate(
    r,
    { $set: { comentarios: com } },
    { new: true }
  );
};

// Remove um recurso
module.exports.remove = function (id) {
  return Recurso.deleteOne({ _id: id });
};

module.exports.removeCom = function (re, id) {
  return Recurso.update(
    { _id: re },
    { $pull: { comentarios: { id_coment: id } } }
  );
};

// Edita um recurso
module.exports.edit = function (id, r) {
  return Recurso.findByIdAndUpdate(id, r, { new: true });
};

module.exports.addReply = function (re, id, info) {
  //console.log(re + "     " + id + "     " + info);
  return Recurso.update(
    { _id: re, "comentarios.id_coment": id },
    {
      $push: {
        "comentarios.$.comentarios": JSON.parse(info),
      },
    }
  ).exec();
};

module.exports.lookUpLast = function () {
  return Recurso.find().sort({ dataRegisto: 1 }).exec();
};

module.exports.lookUpByTitulo = function (t) {
  return Recurso.find({ titulo: t }).exec();
};
