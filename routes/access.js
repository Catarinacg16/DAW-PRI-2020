var fs = require('fs');
var manifest = JSON.parse(fs.readFileSync("./manifest.json"));
var sha = require("crypto-js/sha256");
var AdmZip = require('adm-zip');



module.exports.isAccessible = function (folderPath) {
    var ls =fs.readdirSync(folderPath);
    var manif = fs.readFileSync(folderPath+"/manifest-sha256.txt").toString().split('\n');
    var jsonmanif = {baseZip:folderPath,doc:[]};
    manif.forEach(e=>{
      var [hash,path] = e.split(" ");
      jsonmanif.doc.push({path:   hash})
      if(jsonmanif.baseZip==folderPath) jsonmanif.baseZip+="/"+path.split('/')[0]+".zip";
    })
    var zip = AdmZip(jsonmanif.baseZip);
    zip.getEntries().forEach(e=>{
      if (! (sha(zip.readFile(e))==jsonmanif.doc[e.entryName])){
        return false
      }
    })
    return jsonmanif.baseZip;
  }