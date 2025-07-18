import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * ✅ Ambil semua source untuk 1 episode tertentu
 * GET /api/content/:contentId/episode/:episodeId/sources
 */
export async function getEpisodeSources(contentId: number, episodeId: number) {
  try {
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
    });

    if (!episode || episode.content_id !== contentId) {
      return Response.json(
        { error: "Episode tidak ditemukan di konten ini" },
        { status: 404 }
      );
    }

    const sources = await prisma.episodesource.findMany({
      where: { episode_id: episodeId },
      orderBy: { priority: "asc" },
      include: { qualities: true },
    });

    return Response.json(sources);
  } catch (err) {
    console.error("❌ Gagal ambil sources:", err);
    return Response.json({ error: "Gagal mengambil sources" }, { status: 500 });
  }
}

/**
 * ✅ Tambahkan source ke episode tertentu
 * POST /api/content/:contentId/episode/:episodeId/sources
 */
export async function addEpisodeSource(
  contentId: number,
  episodeId: number,
  req: Request
) {
  try {
    const body = await req.json();
    const { provider, priority = 0, qualities = [] } = body;

    if (!provider || !Array.isArray(qualities) || qualities.length === 0) {
      return Response.json(
        { error: "Provider dan kualitas wajib diisi" },
        { status: 400 }
      );
    }

    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
    });
    if (!episode || episode.content_id !== contentId) {
      return Response.json(
        { error: "Episode tidak valid untuk konten ini" },
        { status: 404 }
      );
    }

    const created = await prisma.episodesource.create({
      data: {
        episode_id: episodeId,
        provider,
        priority,
        qualities: {
          create: qualities.map((q: any) => ({
            resolution: q.resolution,
            url: q.url,
          })),
        },
      },
      include: { qualities: true },
    });

    return Response.json(
      { message: "Source berhasil ditambahkan", source: created },
      { status: 201 }
    );
  } catch (err) {
    console.error("🔥 Gagal tambah source:", err);
    return Response.json(
      { error: "Gagal menambahkan source", detail: `${err}` },
      { status: 500 }
    );
  }
}

/**
 * ❌ (Opsional) Hapus satu source dari episode
 * DELETE /api/content/:contentId/episode/:episodeId/sources/:sourceId
 */
export async function deleteEpisodeSource(
  contentId: number,
  episodeId: number,
  sourceId: number
) {
  try {
    const source = await prisma.episodesource.findUnique({
      where: { id: sourceId },
      include: { episode: true },
    });

    if (
      !source ||
      source.episode_id !== episodeId ||
      source.episode.content_id !== contentId
    ) {
      return Response.json(
        { error: "Source tidak ditemukan untuk episode ini" },
        { status: 404 }
      );
    }

    await prisma.episodesourcequality.deleteMany({
      where: { episodesource_id: sourceId },
    });

    await prisma.episodesource.delete({
      where: { id: sourceId },
    });

    return new Response("Source berhasil dihapus", { status: 200 });
  } catch (err) {
    console.error("❌ Gagal hapus source:", err);
    return Response.json({ error: "Gagal hapus source" }, { status: 500 });
  }
}
