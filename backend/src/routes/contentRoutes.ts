import {
  createContent,
  deleteContent,
  getAllContents,
  getContentById,
  getContentBySlug,
  updateContent,
} from "../controllers/content";

import {
  createEpisodeForContent,
  getEpisodesByContent,
} from "../controllers/episode";

import {
  addEpisodeSource,
  getEpisodeSources,
} from "../controllers/episodeSource";

import { requireRole } from "../middleware/roles";

export async function contentRoutes(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  // ============================
  // 📦 KONTEN ROUTES
  // ============================

  if (method === "GET" && path === "/api/content") {
    return getAllContents();
  }

  const contentMatch = path.match(/^\/api\/content\/(\d+)$/);
  if (contentMatch && method === "GET") {
    return getContentById(Number(contentMatch[1]));
  }

  const slugMatch = path.match(/^\/api\/content\/slug\/([a-zA-Z0-9-]+)$/);
  if (slugMatch && method === "GET") {
    return getContentBySlug(slugMatch[1]);
  }

  if (method === "POST" && path === "/api/content") {
    const { error } = await requireRole(req, ["admin"]);
    if (error) return error;
    return createContent(req);
  }

  if (contentMatch && method === "PUT") {
    const contentId = Number(contentMatch[1]);
    const { error } = await requireRole(req, ["admin"]);
    if (error) return error;
    return updateContent(contentId, req);
  }

  if (contentMatch && method === "DELETE") {
    const contentId = Number(contentMatch[1]);
    const { error } = await requireRole(req, ["admin"]);
    if (error) return error;
    return deleteContent(contentId);
  }

  // ============================
  // 📺 EPISODE ROUTES
  // ============================

  const episodeMatch = path.match(/^\/api\/content\/(\d+)\/episode$/);
  if (episodeMatch) {
    const contentId = Number(episodeMatch[1]);
    const seasonParam = url.searchParams.get("season");
    const season = seasonParam ? Number(seasonParam) : undefined;

    if (method === "GET") {
      return getEpisodesByContent(contentId, season);
    }

    if (method === "POST") {
      const { error } = await requireRole(req, ["admin"]);
      if (error) return error;
      return createEpisodeForContent(contentId, req);
    }
  }

  // ============================
  // 🔗 SOURCE ROUTES
  // ============================

  const sourceMatch = path.match(
    /^\/api\/content\/(\d+)\/episode\/(\d+)\/sources$/
  );
  if (sourceMatch) {
    const contentId = Number(sourceMatch[1]);
    const episodeId = Number(sourceMatch[2]);

    if (method === "GET") {
      return getEpisodeSources(contentId, episodeId);
    }

    if (method === "POST") {
      const { error } = await requireRole(req, ["admin"]);
      if (error) return error;
      return addEpisodeSource(contentId, episodeId, req);
    }
  }

  return new Response("Not Found", { status: 404 });
}
