let addAutor = () => {
  let fileInput = `
            <div class="row mb-3">
                <input class="w3-input w3-border w3-round form-control" type="text" placeholder="autor" name="autor" required="">
            </div>
    `;
  $("#addAutor").append(fileInput);
};

let addTag = () => {
  let fileInput = `
            <div class="row mb-3">
                <input class="w3-input w3-border w3-round form-control" type="text" placeholder="tag" name="tags" required="">

            </div>
    `;
  $("#addTag").append(fileInput);
};

let remTag = (a) => {
  var div = document.getElementById("remTag"+a);
  div.remove();
};

let remAutor = (a) => {
  var div = document.getElementById("remAutor"+a);
  div.remove();
};