//para aparecer replies
function addi(rec, id) {
  console.log(rec);
  console.log(id);
  //console.log(rec[0]);
  var file = $(
    rec.comentarios.forEach((element) => {
      ` 
          <li class="w3-padding-16">
                <b> ${rec.nome_utilizador} </b>
                <br></br>
                <b> ${rec.data} </b>
                <br></br>
                <span> ${rec.descricao} </span>
                <div id="adiciona"+ ${rec.id_coment}>
                    <input type="button" value="Mostrar replies" onclick="addi("+${rec.comentarios}+","+${rec.id_coment}+")"/>
                </div>
            </li>

     `;
    })
  );
  $("#adiciona" + id).append(file);
}
