var fs = require('fs');
var manifest = JSON.parse(fs.readFileSync("./manifest.json"));
var sha = require("crypto-js/sha256");
var AdmZip = require('adm-zip');
var {rmrf} = require("./ingest");



module.exports.isAccessible = function (folderPath) {
    var ls =fs.readdirSync(folderPath);
    var manif = fs.readFileSync(folderPath+"/manifest-sha256.txt").toString().split('\n');
    let bag = JSON.parse(fs.readFileSync(folderPath+"/bag.txt").toString());

    var jsonmanif = {baseZip:folderPath+"/"+bag.zipName,doc:[]};
    manif.forEach(e=>{
      var [hash,path] = e.split(" ");
      jsonmanif.doc.push({[path]:   hash})
    })
    var zip = AdmZip(jsonmanif.baseZip);
    zip.getEntries().forEach(e=>{
      if (! (sha(zip.readFile(e))==jsonmanif.doc[e.entryName])){
        return false
      }
    })
    return jsonmanif.baseZip;
  }

  module.exports.getUncompressedFromId = function (id) {
    var folderPath = __dirname + "/../public/fileStore/" + id + "/";
    var zippath =  module.exports.isAccessible(folderPath);
    var folderOut = __dirname +"/../public/show/"+id+"/"
    if(!fs.existsSync(folderOut))
      fs.mkdirSync(folderOut,{recursive:true});
    
    var zip = AdmZip(zippath);
    zip.extractAllTo(folderOut);
    return folderOut;
  } 

  module.exports.previewFacilitator = function (id) { 
    let deepPath=module.exports.getUncompressedFromId(id);
    let subtract = __dirname+"/../public"
    let shallowPath = deepPath.split(subtract)[1];
    var manifPath = __dirname + "/../public/fileStore/" + id + "/manifest-sha256.txt";
    var firstFile = fs.readFileSync(manifPath).toString().split('\n')[0].split(' ')[1];
    return shallowPath+firstFile;
    
  } 
