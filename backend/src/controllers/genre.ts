import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getGenres() {
  const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });
  return Response.json({ genres });
}

export async function createGenre(req: Request) {
  const { name } = await req.json();

  if (!name) {
    return new Response("Nama genre wajib diisi", { status: 400 });
  }

  const existing = await prisma.genre.findUnique({ where: { name } });
  if (existing) {
    return new Response("Genre sudah ada", { status: 409 });
  }

  const genre = await prisma.genre.create({ data: { name } });
  return Response.json({ message: "Genre ditambahkan", genre });
}
