import { loginController } from "../controllers/auth";

export const authRoutes = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  if (req.method === "POST" && url.pathname === "/api/login") {
    return loginController(req);
  }

  return new Response("Not Found", { status: 404 });
};
