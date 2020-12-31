//para aparecer replies
function addi() {
  console.log("testeReply");
  var file = $(
    "ul.w3-ul.w3-hoverable.w3-white" +
      "each com in recurso.comentarios" +
      "li.w3-padding-16" +
      "span.w3-large=com.nome_utilizador" +
      "br" +
      "span.w3-medium=com.data_comentario" +
      "br" +
      "span=com.descricao" +
      "#adiciona" +
      "input(type='button' value='Mostrar replies' onclick='addi()')"
  );
  $("#adiciona").append(file);
}
