import {
  createEpisode,
  deleteEpisode,
  getEpisodesByContentId,
  updateEpisode,
} from "../controllers/episode";
import { requireRole } from "../middleware/roles";

export async function episodeRoutes(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;
  const idMatch = path.match(/^\/api\/episode\/(\d+)$/);

  // GET /api/episode/:contentId
  if (method === "GET" && idMatch) {
    return getEpisodesByContentId(Number(idMatch[1]));
  }

  // Admin only
  const { error } = await requireRole(req, ["admin"]);
  if (error) return error;

  if (method === "POST" && path === "/api/episode") {
    return createEpisode(req);
  }

  if (method === "PUT" && idMatch) {
    return updateEpisode(Number(idMatch[1]), req);
  }

  if (method === "DELETE" && idMatch) {
    return deleteEpisode(Number(idMatch[1]));
  }

  return new Response("Not Found", { status: 404 });
}
