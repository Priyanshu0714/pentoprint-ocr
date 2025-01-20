document.getElementById("file").addEventListener("change",()=>{
    const box=document.getElementById("box-description")
    box.innerHTML=document.getElementById("file").files[0].name
    if(box.classList.contains("text-red-500")){
        box.classList.remove("text-red-500")
    }
})
function validateForm() {
    const fileInput = document.getElementById("file");
    const file = fileInput.files[0];
    const box = document.getElementById("box-description");

    if (file) {
        if(file.name.endsWith(".pdf")){
            return true;
        }
        else{
            box.innerHTML="Invalid File type!"
            box.classList.add("text-red-500")
            return false;
        }
    } else {
        box.innerHTML = "No file selected!";
        box.classList.add("text-red-500");
        return false;
    }
}
