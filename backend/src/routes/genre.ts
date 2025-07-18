import { createGenre, getGenres } from "../controllers/genre";
import { requireRole } from "../middleware/roles";

export async function genreRoutes(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const method = req.method;

  // GET /api/genre
  if (method === "GET" && url.pathname === "/api/genre") {
    return getGenres();
  }

  // POST /api/genre → admin only
  const { error } = await requireRole(req, ["admin"]);
  if (error) return error;

  if (method === "POST" && url.pathname === "/api/genre") {
    return createGenre(req);
  }

  return new Response("Not Found", { status: 404 });
}
