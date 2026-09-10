import { Router } from "express";
import { supabase } from "../supabaseClient.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const componentsRouter = Router();

 
componentsRouter.get("/", async (req, res) => {
  const { search, category } = req.query;

  let query = supabase
    .from("components")
    .select("*, profiles(id, name)")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);
  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load components" });
  }

  res.json({ components: data });
});

 
componentsRouter.get("/:slug", async (req, res) => {
  const { data, error } = await supabase
    .from("components")
    .select("*, profiles(id, name)")
    .eq("slug", req.params.slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return res.status(404).json({ error: "Component not found" });
    }
    console.error(error);
    return res.status(500).json({ error: "Failed to load component" });
  }

  res.json({ component: data });
});

 
componentsRouter.get("/mine/list", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("components")
    .select("*, profiles(id, name)")
    .eq("author_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load your components" });
  }

  res.json({ components: data });
});

 
componentsRouter.post("/", requireAuth, async (req, res) => {
  const { name, description, category, code, install_command, dependencies, tags } = req.body;

  if (!name || !description || !category || !code || !install_command) {
    return res.status(400).json({
      error: "name, description, category, code, and install_command are required",
    });
  }

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const { data, error } = await supabase
    .from("components")
    .insert({
      name,
      slug,
      description,
      category,
      code,
      install_command,
      dependencies: dependencies || [],
      tags: tags || [],
      author_id: req.user.id,  
    })
    .select("*, profiles(id, name)")
    .single();

  if (error) {
    console.error(error);
   
    if (error.code === "23505") {
      return res.status(409).json({ error: "A component with that name already exists" });
    }
    return res.status(500).json({ error: "Failed to create component" });
  }

  res.status(201).json({ component: data });
});

componentsRouter.put("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data: existing, error: fetchError } = await supabase
    .from("components")
    .select("author_id")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return res.status(404).json({ error: "Component not found" });
  }
  if (existing.author_id !== req.user.id) {
    return res.status(403).json({ error: "You can only edit your own components" });
  }

  const { name, description, category, code, install_command, dependencies, tags, published } = req.body;

  const { data, error } = await supabase
    .from("components")
    .update({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(code !== undefined && { code }),
      ...(install_command !== undefined && { install_command }),
      ...(dependencies !== undefined && { dependencies }),
      ...(tags !== undefined && { tags }),
      ...(published !== undefined && { published }),
    })
    .eq("id", id)
    .select("*, profiles(id, name)")
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update component" });
  }

  res.json({ component: data });
});
 
componentsRouter.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data: existing, error: fetchError } = await supabase
    .from("components")
    .select("author_id")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return res.status(404).json({ error: "Component not found" });
  }
  if (existing.author_id !== req.user.id) {
    return res.status(403).json({ error: "You can only delete your own components" });
  }

  const { error } = await supabase.from("components").delete().eq("id", id);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete component" });
  }

  res.status(204).send();
});