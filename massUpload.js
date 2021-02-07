var {ingest}= require("./routes/ingest");
var fs = require('fs');
var AdmZip= require("adm-zip");

if(!fs.existsSync("./massUploadZipped/"))
    fs.mkdirSync("./massUploadZipped/");

fs.readdirSync("./massUpload").forEach(e=>{
    console.log(e);
    if(e.split('.')[1]==undefined){
        console.log("Its a folder :(");
    }
    else{
    var zip = AdmZip();
    zip.addLocalFile("./massUpload/"+e);
    zip.writeZip("./massUploadZipped/"+e.split('.')[0]+".zip");
    }
})

var bigJson= require("./massUploadZipped/recursos.json");
var dbImportReadyJson=[];


bigJson.forEach(e=>{
    console.log(e);
    var rb = JSON.parse(JSON.stringify(e));
    delete rb.file;
    var f= {path:"massUploadZipped/"+ e.file, originalname : e.file,mimetype: "/zip"};
    var req={body:rb,user:{email:e.produtor}};

    console.log(ingest(f,req));

    
})


