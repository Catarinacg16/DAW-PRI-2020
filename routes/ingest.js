var fs = require('fs');
var manifest = JSON.parse(fs.readFileSync("./manifest.json"));
var decompress = require('decompress');
const getStream = require('get-stream')
var Recursos = require("../controller/recurso")


module.exports.ingest = function (f, req) {
    //VERIFICAÇAO
    
    let oldPath = f.path;
    console.log(f.originalname);
    if(!checkFileName(f.originalname)) return "ZIP NAME";
  
    if(!(manifest.formatoExterno == f.mimetype.split('/')[1])) return "MIME TYPE";
    if(!checkZipRecursive(__dirname+"/../"+oldPath)) return "SUBDIR";


    var d = new Date().toISOString().substr(0, 16);
    req.body.dataRegisto = d;
    req.body.produtor=req.user.email;
    Recursos.insert(req.body).then(data=>{
    var id = data._id;
    let newPath = __dirname + '/../public/fileStore/' + id;
    fs.mkdirSync(newPath);
    newPath+="/"+ f.originalname;
    fs.rename(oldPath, newPath, function (err) {
        if (err) {
          console.log( err+":Erro a mover o ficheiro")
        } 
      });
    });
    return true;
  };

  function checkZipRecursive(file){
      console.dir("file:"+file);
    decompress(file,'dist').then(files=>{
        files.forEach(e=>{
            let  path =e.path.split('/');
            if(path[path.length-1].split('.')[1]=="zip") return checkZipRecursive(e);
            else{
               console.log("filefile:"+path[path.length-1]+ "   type:"+ e.type) 
            if(e.type=="file" &&!checkFileName(path[path.length-1])) return false;
            }
        })
    })
    .catch(e=>console.log(e))
    return true;

  }

  function checkFileName(fileName){
    var name = fileName.split('.')[0];
    var exte = fileName.split('.')[1];
    if(manifest.limiteCaracteres < fileName.length) return false;

    if(!manifest.nomesProibidos.includes(name)){

        if(!manifest.formatosInternos.includes(exte)) return false;
        name.split('').forEach(element => {
            if(manifest.caracteresProibidos.includes(element)) return false;
        });    
        return true;
    } else return false;
    
  }