import {
  createSeason,
  deleteSeason,
  getSeasonsByContentId,
  updateSeason,
} from "../controllers/season";
import { requireRole } from "../middleware/roles";

export async function seasonRoutes(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;
  const idMatch = path.match(/^\/api\/season\/(\d+)$/);

  // GET /api/season/:contentId → Public
  if (method === "GET" && idMatch) {
    return getSeasonsByContentId(Number(idMatch[1]));
  }

  // Admin only
  const { error } = await requireRole(req, ["admin"]);
  if (error) return error;

  // POST /api/season
  if (method === "POST" && path === "/api/season") {
    return createSeason(req);
  }

  // PUT /api/season/:id
  if (method === "PUT" && idMatch) {
    return updateSeason(Number(idMatch[1]), req);
  }

  // DELETE /api/season/:id
  if (method === "DELETE" && idMatch) {
    return deleteSeason(Number(idMatch[1]));
  }

  return new Response("Not Found", { status: 404 });
}
