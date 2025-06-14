import Tesseract from "tesseract.js";

export async function extractTextFromImage(file) {
  const imageUrl = URL.createObjectURL(file);

  const result = await Tesseract.recognize(imageUrl, "eng", {
    logger: (m) => console.log(m), 
  });

  console.log("Hasil OCR:", result.data.text);
  return result.data.text;
}
