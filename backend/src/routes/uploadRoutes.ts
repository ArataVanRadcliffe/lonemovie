import { krakenfileUpload } from "../controllers/upload/krakenfile";
import { pixeldrainUpload } from "../controllers/upload/pixeldrain";

export async function uploadRoutes(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const method = req.method;

  if (method === "POST" && pathname === "/api/upload/pixeldrain") {
    return await pixeldrainUpload(req);
  }

  if (method === "POST" && pathname === "/api/upload/krakenfile") {
    return await krakenfileUpload(req);
  }

  return new Response("❌ Upload route not found", { status: 404 });
}
