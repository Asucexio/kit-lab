import "dotenv/config";
import express from "express";
import cors from "cors";
import { supabase } from "./supabaseClient.js";
import { componentsRouter } from "./routes/components.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/components", componentsRouter);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/health/db", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});