const axios = require("axios");
const fs = require("fs");
const path = require("path");

const endpoint = "https://ocr140705.cognitiveservices.azure.com/";
const subscriptionKey = "34K3RpNb2hZgUwbaXY534Mk3AzKpsjqGVZ9cNpTtJc3AYYNbA7DmJQQJ99BAACYeBjFXJ3w3AAAFACOG8XjR";

const dirname = path.join(__dirname, "output-images");

// Function to get all image file paths
async function getImageFilePaths() {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        reject(err);
      } else {
        resolve(files.map(file => path.join(dirname, file)));
      }
    });
  });
}

// Function to recognize handwriting from an image
async function recognizeHandwriting(imageFilePath) {
  try {
    const imageBuffer = fs.readFileSync(imageFilePath);
    const readResponse = await axios.post(
      `${endpoint}/vision/v3.2/read/analyze`,
      imageBuffer,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": subscriptionKey,
          "Content-Type": "application/octet-stream",
        },
      }
    );

    const operationLocation = readResponse.headers["operation-location"];
    console.log("Operation location for", imageFilePath, ":", operationLocation);

    let result = null;
    while (!result || result.status === "running" || result.status === "notStarted") {
      console.log("Waiting for the result for", imageFilePath, "...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      const resultResponse = await axios.get(operationLocation, {
        headers: {
          "Ocp-Apim-Subscription-Key": subscriptionKey,
        },
      });
      result = resultResponse.data;
    }

    let recognizedText = "";
    if (result.status === "succeeded") {
      console.log("Recognized Text for", imageFilePath, ":");
      result.analyzeResult.readResults.forEach(page => {
        page.lines.forEach(line => {
          recognizedText += line.text + "\n";
        });
      });
    } else {
      console.log("Failed to analyze the handwriting for", imageFilePath);
    }

    return recognizedText.trim();
  } catch (error) {
    console.error("Error for", imageFilePath, ":", error.response ? error.response.data : error.message);
    return null;
  }
}

// Process images after ensuring the file list is ready
async function processImages() {
  try {
    const imageFilePaths = await getImageFilePaths(); // Wait until files are loaded
    let allRecognizedText = "";

    for (const imageFilePath of imageFilePaths) {
      const recognizedText = await recognizeHandwriting(imageFilePath);
      if (recognizedText) {
        allRecognizedText += recognizedText + "\n\n";
      }
    }

    if (allRecognizedText) {
      fs.writeFileSync("./recognized_txt/recognized_text.txt", allRecognizedText.trim(), "utf8");
      fs.appendFileSync("./recognized_txt/recognized_text.txt", "\n\nExtract only the names and UIDs of the data and give the output as CSV", "utf8");
    } else {
      console.log("No recognized text to save.");
    }
  } catch (error) {
    console.error("Error processing images:", error);
  }
}
module.exports = processImages;
