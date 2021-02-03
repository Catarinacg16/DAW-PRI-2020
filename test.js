var decompress = require('decompress');
var fs = require('fs');
var fil = fs.readFileSync("./111.zip");
const zip = decompress(fil,'dist')
    .then(data=>{console.log(data)})
    .catch(e=>console.log(e));
    console.log(zip);