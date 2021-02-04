var decompress = require('decompress');
var fs = require('fs');
var sha = require("crypto-js/sha256");
var AdmZip = require('adm-zip');
var { v4: uuid } = require("uuid");
var path = require('path');

var fil = fs.readFileSync("./111.zip");
wrapper("./insidezip.zip");
function wrapper(path){
var zip=AdmZip(path);
zip.getEntries().forEach(element => {
    console.log(element.toString());
    if(element.name.split('.')[1]=="zip") {
        var thiselemid= uuid();
        var thispath=__dirname+"/tmp/";
        fs.mkdirSync(thispath);
        
        fs.writeFileSync(thispath+ thiselemid+ ".zip",zip.readFile(element))
        wrapper(thispath+ thiselemid+ ".zip");
        //rimraf(thispath);
    }
});
return console.log("DONE");    
}
var i = true;
i &= true;
console.log(i)

