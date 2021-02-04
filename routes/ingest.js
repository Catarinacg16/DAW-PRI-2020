var fs = require('fs');
var manifest = JSON.parse(fs.readFileSync("./manifest.json"));
//var decompress = require('decompress');
const getStream = require('get-stream')
var Recursos = require("../controller/recurso")
var sha = require("crypto-js/sha256");
var AdmZip = require('adm-zip');
var path = require('path');

var { v4: uuid } = require("uuid");


module.exports.ingest = function (f, req) {
    //VERIFICAÇAO
    
    let oldPath = f.path;
    if(!checkFileName(f.originalname)) return "ZIP NAME";
  
    if(!(manifest.formatoExterno == f.mimetype.split('/')[1])) return "MIME TYPE";
    var isValid= checkZipRecursive(__dirname+"/../"+oldPath);
    if(!isValid) return "SUBDIR";
    

    var d = new Date().toISOString().substr(0, 16);
    req.body.dataRegisto = d;
    req.body.produtor=req.user.email;
    Recursos.insert(req.body).then(data=>{
    var id = data._id;
    let newPath = __dirname + '/../public/fileStore/' + id;
    

    var cs =makeCheckSum(__dirname+"/../"+oldPath)
      fs.mkdirSync(newPath);
      fs.writeFileSync(newPath+"/manifest-sha256.txt",cs);

    
    newPath+="/"+ f.originalname;
    fs.rename(oldPath, newPath, function (err) {
        if (err) {
          console.log( err+":Erro a mover o ficheiro")
        } 
      });

  }).catch(e=>console.log(e));
  return true;
    

  };

  function makeCheckSum(file){
    var ret= "";
    var zip = AdmZip(file);
    zip.getEntries().forEach(e=>{
          if(!e.isDirectory){
          ret+=sha(zip.readFile(e).toString());
          var pathbuilder =e.entryName;
          ret+=" "+ pathbuilder + '\n';
          }
      });
      return ret;
  }

  function checkZipRecursive(file){
    var zip=AdmZip(file);
    var ret = true;
    zip.getEntries().forEach(e=>{
            let  path =e.name;
            if(path.split('.')[1]=="zip") {
              var thiselemid= uuid();
              var thispath=__dirname+"/../tmp/";
              fs.mkdirSync(thispath);
              fs.writeFileSync(thispath+ thiselemid+ ".zip",zip.readFile(e))
              ret &= checkZipRecursive(thispath+ thiselemid+ ".zip");
              rmrf(thispath);
            }
            else{
            if(!e.isDirectory) ret&=checkFileName(path);
            }
        })
        return ret;

  }

  function checkFileName(fileName){
    var name = fileName.split('.')[0];
    var exte = fileName.split('.')[1];
    var ret= true;
    ret&= (name!=undefined && exte!= undefined) ;

    ret&= (manifest.limiteCaracteres >= fileName.length);

    ret&= !manifest.nomesProibidos.includes(name);

    ret&= manifest.formatosInternos.includes(exte);

    name.split('').forEach(element => {
        ret&= !manifest.caracteresProibidos.includes(element);
        });    
    return ret;
    
  }

function rmrf(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            var entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
}