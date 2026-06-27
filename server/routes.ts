import type { Express } from "express";
import { createServer, type Server } from "http";

const TRIPO_BASE = "https://api.tripo3d.ai/v2/openapi";

async function tripoFetch(path: string, method = "GET", body?: object) {
  const apiKey = process.env.TRIPO_API_KEY;
  if (!apiKey) {
    throw new Error("TRIPO_API_KEY is not configured. Please add it to your Replit secrets.");
  }

  const res = await fetch(`${TRIPO_BASE}${path}`, {
    method,
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Tripo3D returned invalid response (${res.status}): ${text.slice(0, 200)}`);
  }

  if (!res.ok || (json.code !== undefined && json.code !== 0)) {
    throw new Error(json.message || `Tripo3D API error (${res.status})`);
  }
  return json;
}

export async function registerRoutes(app: Express): Promise<Server> {

  // Submit a text-to-3D generation task
  app.post("/api/generate-3d", async (req, res) => {
    try {
      const { prompt, quality = "standard" } = req.body as { prompt: string; quality?: string };
      if (!prompt?.trim()) {
        return res.status(400).json({ error: "Prompt is required" });
      }
      const faceLimit = quality === "high" ? 50000 : 10000;
      const json = await tripoFetch("/task", "POST", {
        type: "text_to_model",
        prompt: prompt.trim(),
        model_version: "v2.0-20240919",
        face_limit: faceLimit,
        texture: false,
        pbr: false,
      });
      res.json({ taskId: json.data.task_id });
    } catch (err: any) {
      console.error("[generate-3d]", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // Poll task status
  app.get("/api/generate-3d/status/:taskId", async (req, res) => {
    try {
      const { taskId } = req.params;
      const json = await tripoFetch(`/task/${taskId}`);
      const d = json.data;
      res.json({
        status: d.status,
        progress: d.progress ?? 0,
        glbUrl: d.output?.base_model ?? null,
        previewUrl: d.output?.rendered_image ?? d.thumbnail ?? null,
      });
    } catch (err: any) {
      console.error("[generate-3d/status]", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
