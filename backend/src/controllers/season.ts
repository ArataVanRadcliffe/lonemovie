import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET /api/season/:contentId
export async function getSeasonsByContentId(contentId: number) {
  const seasons = await prisma.season.findMany({
    where: { content_id: contentId },
    orderBy: { season_number: "asc" },
  });
  return Response.json(seasons);
}

// POST /api/season
export async function createSeason(req: Request) {
  const data = await req.json();

  if (!data.content_id || !data.season_number || !data.title) {
    return new Response("Field wajib: content_id, season_number, title", {
      status: 400,
    });
  }

  const season = await prisma.season.create({ data });
  return Response.json(season, { status: 201 });
}

// PUT /api/season/:id
export async function updateSeason(id: number, req: Request) {
  const data = await req.json();

  const updated = await prisma.season.update({
    where: { id },
    data,
  });

  return Response.json(updated);
}

// DELETE /api/season/:id
export async function deleteSeason(id: number) {
  await prisma.season.delete({ where: { id } });
  return new Response("Season dihapus", { status: 200 });
}
