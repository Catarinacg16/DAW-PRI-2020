//para aparecer replies
let addi = (com) => {
  //document.write(rec.comentarios.length)
  var div = document.getElementById(com.id_coment);
  document.getElementById("b" + com.id_coment).style.visibility = "hidden";
  com.comentarios.forEach((element) => {
    var reply = ` 
    <ul class="w3-ul w3-hoverable w3-gray">
    <li class="w3-padding-16">
          <b> ${element.nome_utilizador} </b>
          <br></br>
          <b> ${element.data} </b>
          <br></br>
          <span> ${element.descricao} </span>
          <div id=${element.id_coment}>
              <input type="button" value="Ver replies" onclick='addi(${element})'/>
          </div>
      </li>
      </ul>
`;
    $(div).append(reply);
  });
};
