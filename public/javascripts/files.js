let addAutor = () => {
    let fileInput = `
            <div class="row mb-3">
                <input class="form-control" type="text" placeholder="autor" name="autor" required="">
            </div>
    `;
    $("#addAutor").append(fileInput);
};

let addTag = () => {
    let fileInput = `
            <div class="row mb-3">
                <input class="form-control" type="text" placeholder="tag" name="tag" required="">
            </div>
    `;
    $("#addTag").append(fileInput);
};