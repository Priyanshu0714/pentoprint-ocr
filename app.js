const path = require("path");
const express = require('express');
const multer = require("multer");
const convertPdfToImages=require("./convert.js")
const grayscale=require("./grayscale.js")
const app = express();
const imageRead=require("./imageRead.js")
// import { main as openAIapi } from './openaiAPI.js'; 
const openai=require("./openaiAPI.js")

const deletefile=require("./deletefiles.js")
const port = 3000;
app.use(express.static(path.join(__dirname, "public")));

const storage=multer.diskStorage({
  destination:function(req,file,cb){
    return cb(null,"./uploads")
  },
  filename:function(req,file,cb){
    return cb(null,file.originalname)
  }
})
const upload=multer({storage:storage})
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.get("/", (req, res) => {
  return res.render("index")
});

// here is the main login for file handling
app.post("/upload",upload.single("file"),async(req,res)=>{
  const filepath=req.file.path
 
  // here pdf is converted to images
  await convertPdfToImages(filepath);
  deletefile("./uploads",".pdf")
  // now converting the images to grayscale
  await grayscale();
  deletefile("./output-images",".png")
  // now send the data to microsoft azure api
  await imageRead();
  deletefile("./grayscale_img",".png")
  // now read the file using the lamma model
  openai();
  deletefile("./recognized_txt",".txt")
  // now will send the pdfs to the server
  return res.redirect("/")
})


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
