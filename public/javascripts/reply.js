//para aparecer replies
let addi = (com) => {
  //document.write(rec.comentarios.length)
  var div = document.getElementById(com.id_coment);
  document.getElementById("b" + com.id_coment).style.visibility = "hidden";

  com.comentarios.forEach((element) => {
    var reply = ` 
    <ul class="w3-ul w3-hoverable w3-light-gray">
    <script type="text/javascript">
   document.getElementById("b" + ${com.id_coment}).style.visibility='visible';
</script>
    <li class="w3-padding-16">
          <b> ${element.nome_utilizador} </b>
          <br></br>
          <b> ${element.data} </b>
          <br></br>
          <span> ${element.descricao} </span>
      </li>
      </ul>
`;
    $(div).append(reply);
  });
};

/* para o caso

          <div id=${element.id_coment}>
              <input type="button" value="Ver replies" onclick="addi('${element}')"/>
          </div>
          */

let addReply = (rec, com, nivel) => {
  console.log("entreii");
  var div = document.getElementById("r" + com.id_coment);
  if (typeof div != "undefined" && div != null) {
    // Exists.
    console.log("EnCONTREI");
  } else console.log("not found");
  if (nivel === "consumidor") {
    var path = "/consumidor/recurso/" + rec + "/" + com.id_coment;
  } else {
    if (nivel === "produtor") {
      var path = "/consumidor/recurso/" + rec + "/" + com.id_coment;
    } else if (nivel === "admin") {
      var path = "/administrador/recurso/" + rec + "/" + com.id_coment;
    }
  }
  var reply = ` 
      <form action=${path} method="POST" enctype="form-data">
        <li class="w3-padding-16"><input class="form-control" type="text" placeholder="comentário ..." name="descricao" />
        <input class="btn btn-lg btn-primary" type="submit" value="Submit" /></li>
      </form>
    `;
  $(div).append(reply);
};
