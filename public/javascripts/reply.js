//para aparecer replies
function addi(rec) {
  console.log(rec);
  var file = $(
    `
    <ul class="w3-ul w3-hoverable w3-pink">
          <li class="w3-padding-16">
                <b> ${rec.nome_utilizador} </b>
                <br></br>
                <b> ${rec.data} </b>
                <br></br>
                <span> ${rec.descricao} </span>
                <div id="adiciona">
                    <input type="button" value="Mostrar replies" onclick="addi("+#{rec.comentarios}+")"/>
                </div>
            </li>
    </ul>`
  );
  $("#adiciona").append(file);
}
