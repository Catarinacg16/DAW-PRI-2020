
let changePass = () => {
    document.getElementById("btn").addEventListener("click", function(event){
        event.target.style.display = "none";
       
let fileInput = `
      <div>
        <label for="pass">Password:</label>
         <input type="password" id="pass" name="password"
             minlength="8" required>
     </div>
     <div>
        <label for="pass">Password:</label>
        <input type="password" id="pass" name="password2"
           minlength="8" required>
     </div>
`;
$("#btnn").append(fileInput)
});
};

