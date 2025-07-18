import { requireAuth } from "./auth";

export async function requireRole(req: Request, allowedRoles: string[]) {
  const { error, user } = await requireAuth(req);
  if (error) return { error };

  // ⛔ Jika role user tidak diizinkan
  if (!allowedRoles.includes(user.role)) {
    return {
      error: Response.json(
        { error: "Forbidden (role not allowed)" },
        { status: 403 }
      ),
    };
  }

  return { user };
}
