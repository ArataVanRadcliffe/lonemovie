import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export async function requireAuth(
  req: Request
): Promise<{ error?: Response; user?: any }> {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: new Response("Unauthorized", { status: 401 }) };
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, JWT_SECRET);
    return { user };
  } catch {
    return { error: new Response("Invalid token", { status: 401 }) };
  }
}
