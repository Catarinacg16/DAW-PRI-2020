let addAutor = () => {
  let fileInput = `
            <div class="row mb-3">
                <input class="w3-input w3-border w3-round form-control" type="text" placeholder="autor" name="autor" required="">
                <button  class="delete">Delete</button>
            </div>
    `;
  $("#addAutor").append(fileInput);
};

let addTag = () => {
  let fileInput = `
            <div class="row mb-3">
                <input class="w3-input w3-border w3-round form-control" type="text" placeholder="tag" name="tag" required="">
            </div>
    `;
  $("#addTag").append(fileInput);
};

