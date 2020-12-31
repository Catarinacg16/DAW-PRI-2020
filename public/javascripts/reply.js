//para aparecer replies
function addi() {
  console.log("testeReply");
  var file = $(
    `
    <ul class="w3-ul w3-hoverable w3-white">
        each com in recurso.comentarios
            <li class="w3-padding-16">
                <span class="w3-large"> $com.nome_utilizador </span>
                <br></br>
                <span class="w3-medium"> $com.data_comentario </span>
                <br></br>
                <span> $com.descricao </span>
                <div id="adiciona"
                    <input type="button" value="Mostrar replies" onclick="addi()"/>
                </div>
            </li>
    </ul>`
  );
  $("#adiciona").append(file);
}
