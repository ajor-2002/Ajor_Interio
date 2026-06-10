import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import OpenAI, { toFile } from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 5000;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      callback(new Error("Only JPG, PNG and WebP images are allowed."));
      return;
    }
    callback(null, true);
  },
});

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

function buildInteriorPrompt({ roomType = "kitchen", style = "modern", material = "", color = "" }) {
  const materialText = material ? `${material} finish` : "premium modular finishes";
  const colorText = color ? `${color} color palette` : "warm neutral color palette";

  return [
    `Transform the uploaded ${roomType} photo into a realistic ${style} interior design.`,
    `Use ${materialText}, ${colorText}, premium lighting, clean cabinetry, realistic proportions, and photorealistic quality.`,
    "Keep the room perspective and major layout similar to the uploaded image.",
    "Do not add text, watermarks, people, logos, or unrealistic objects.",
  ].join(" ");
}

function imageResponsePayload(imageResult) {
  const image = imageResult?.data?.[0];
  if (!image) return null;

  if (image.b64_json) {
    return `data:image/png;base64,${image.b64_json}`;
  }

  return image.url || null;
}

app.get("/", (_req, res) => {
  res.send("AI Room Designer Server Running");
});

app.get("/generate-room", async (_req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      res.status(500).json({ error: "OPENAI_API_KEY is missing in .env" });
      return;
    }

    const client = getOpenAIClient();
    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: "Modern luxury modular kitchen interior with walnut laminate and warm lighting",
      size: "1024x1024",
    });

    const image = imageResponsePayload(result);
    if (!image) {
      res.status(500).json({ error: "Image generation returned no image" });
      return;
    }

    res.json({ image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image generation failed" });
  }
});

app.post("/generate-room", upload.single("roomImage"), async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      res.status(500).json({ error: "OPENAI_API_KEY is missing in .env" });
      return;
    }

    const client = getOpenAIClient();
    const prompt = buildInteriorPrompt(req.body || {});
    let result;

    if (req.file) {
      const imageFile = await toFile(req.file.buffer, req.file.originalname || "room.png", {
        type: req.file.mimetype,
      });

      result = await client.images.edit({
        model: "gpt-image-1",
        image: imageFile,
        prompt,
        size: "1024x1024",
      });
    } else {
      result = await client.images.generate({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
      });
    }

    const image = imageResponsePayload(result);
    if (!image) {
      res.status(500).json({ error: "Image generation returned no image" });
      return;
    }

    res.json({ image, prompt });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message || "Image generation failed",
    });
  }
});

app.use(express.static(__dirname));

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(400).json({
    error: error.message || "Request failed",
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
