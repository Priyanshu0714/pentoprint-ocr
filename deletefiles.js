const fs = require('fs');

function deletefile(folderpath,file_extension){
    fs.readdir(folderpath,(err,files)=>{
        if(err){
            console.log("error reading files")
            return;
        }
        files.forEach(file=>{
            if(file.endsWith(file_extension)){
                console.log(file)
                fs.unlink(`./uploads/${file}`,err=>{
                    if(err){
                        console.log("unable to delete the files")
                    }
                    else{
                        console.log("file delete")
                    }
                })
            }
        })
    })
}
module.exports=deletefile;