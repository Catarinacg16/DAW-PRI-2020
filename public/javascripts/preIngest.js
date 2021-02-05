console.log(document)

$(function(){
  $("#uploadFile").ready().click((event)=>{
    console.log("Nope")
    event.preventDefault();
    alert("COMPRESSING");
    //COMPRESS HERE
    var files =$("#fileIn").prop("files");

    
    files.forEach(element => {
      var abuff=Blob.prototype.arrayBuffer(element).then(
        data=>{
          console.log(data)
        }
      );
    });
  })
    .submit(function(event){
      console.log("Trying to submit form");
      alert("HOLD");
      event.preventDefault();
      return false;}
    )
  }
)
