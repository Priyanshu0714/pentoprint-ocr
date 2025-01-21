document.getElementById("file").addEventListener("change", function () {
    const fileInput = this;
    const file = fileInput.files[0];
    const box = document.getElementById("box-description");
    const previewPopup = document.getElementById("preview-popup");
    const previewCanvas = document.getElementById("preview-canvas");

    if (file) {
        if (file.name.endsWith(".pdf")) {
            box.innerHTML = file.name;
            box.classList.remove("text-red-500");

            // to enable the preview button
            previewButton = document.getElementById("previewbutton");
            previewButton.classList.remove("hidden");

            // Show the preview popup
            previewPopup.classList.replace("hidden", "flex");

            // Read and display the PDF using PDF.js
            const reader = new FileReader();
            reader.onload = function (event) {
                const typedarray = new Uint8Array(event.target.result);

                pdfjsLib.getDocument(typedarray).promise.then(pdf => {
                    pdf.getPage(1).then(page => {
                        const viewport = page.getViewport({ scale: 1 }); // First, get actual dimensions                        
                        const maxWidth = 500;
                        const scale = Math.min(1, maxWidth / viewport.width); // Limit by max width
                        const scaledViewport = page.getViewport({ scale });
                        const canvas = previewCanvas;
                        const ctx = canvas.getContext("2d");

                        canvas.width = scaledViewport.width;
                        canvas.height = scaledViewport.height;

                        page.render({ canvasContext: ctx, viewport: scaledViewport });
                    });
                });
            };
            reader.readAsArrayBuffer(file);
        } else {
            box.innerHTML = "Invalid File type!";
            box.classList.add("text-red-500");
        }
    }
});

// Function to close the preview popup
function closePreview() {
    document.getElementById("preview-popup").classList.replace("flex", "hidden");
}

// For getting the preview-pop up using the preview button
document.getElementById("previewbutton").addEventListener("click", () => {
    document.getElementById("preview-popup").classList.replace("hidden", "flex");
});
