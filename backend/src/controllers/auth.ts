import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient();

export async function loginController(req: Request): Promise<Response> {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return Response.json(
      { error: "Email dan password wajib diisi" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.role !== "admin") {
    return Response.json(
      { error: "Akun tidak ditemukan atau bukan admin" },
      { status: 401 }
    );
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return Response.json({ error: "Password salah" }, { status: 401 });
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return Response.json({
    message: "Login berhasil",
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
}
