import express from "express";
import cors from "cors";
import { config } from "dotenv";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFExtract } from "pdf.js-extract";

config({
  path: "\.env",
})

const app = express();
app.use(cors({ 
  origin: process.env.FRONTEND_URL, 
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://doc-gpt-tau.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const pdfExtract = new PDFExtract();

const extractTextFromPDF = async (buffer) => {
  return new Promise((resolve, reject) => {
    pdfExtract.extractBuffer(buffer, {}, (err, data) => {
      if (err) return reject(err);
      const extractedText = data.pages
        .map(page => page.content.map(item => item.str).join(" "))
        .join("\n");
      resolve(extractedText);
    });
  });
};

app.get('/', (req, res) => {
  res.send('Server is working...')
})

app.post("/upload", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const text = await extractTextFromPDF(req.file.buffer);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(`Summarize the following text:\n\n${text}`);
    const response = await result.response;
    const summary = response.text();
    res.json({ summary });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/ask", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "No question provided" });
    }
    const text = await extractTextFromPDF(req.file.buffer);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(`Answer the following question based on the document:\n\nQuestion: ${question}\n\nDocument:\n${text}`);
    const response = await result.response;
    const answer = response.text(); 
    res.json({ answer });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
