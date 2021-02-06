let changePass = () => {
  document.getElementById("btn").addEventListener("click", function (event) {
    event.target.style.display = "none";

    let fileInput = `
      <div>
        <label for="pass">Password:</label>
         <input class="w3-input w3-border w3-round form-control" type="password" id="pass" name="password"
             minlength="8" required>
     </div>
     <div>
        <label for="pass">Confirme password:</label>
        <input class="w3-input w3-border w3-round form-control" type="password" id="pass" name="password2"
           minlength="8" required>
     </div>

`;
    $("#btnn").append(fileInput);
  });
};
