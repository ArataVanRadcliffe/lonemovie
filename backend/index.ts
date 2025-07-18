import "dotenv/config"; // ✅ load .env otomatis
import { authRoutes } from "./src/routes/auth";
import { contentRoutes } from "./src/routes/contentRoutes";
import { genreRoutes } from "./src/routes/genre";
import { seasonRoutes } from "./src/routes/season";
import { uploadRoutes } from "./src/routes/uploadRoutes";

// ✅ CORS Handler
function withCORS(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// ✅ PORT dari .env atau fallback
const PORT = Number(process.env.PORT) || 3001;

// ✅ Main server
const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    if (method === "OPTIONS") {
      return withCORS(new Response(null, { status: 204 }));
    }

    try {
      if (path.startsWith("/api/login") || path.startsWith("/api/register")) {
        return withCORS(await authRoutes(req));
      }
      if (path.startsWith("/api/genre")) {
        return withCORS(await genreRoutes(req));
      }
      if (path.startsWith("/api/season")) {
        return withCORS(await seasonRoutes(req));
      }
      if (path.startsWith("/api/content")) {
        return withCORS(await contentRoutes(req));
      }
      if (path.startsWith("/api/upload")) {
        return withCORS(await uploadRoutes(req));
      }

      return withCORS(new Response("Route Not Found", { status: 404 }));
    } catch (err: any) {
      console.error("🔥 INTERNAL SERVER ERROR:", err);
      return withCORS(new Response("Internal Server Error", { status: 500 }));
    }
  },
});

console.log(`🟢 Server running at http://localhost:${server.port}`);
