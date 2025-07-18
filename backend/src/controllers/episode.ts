import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * ✅ Ambil semua episode berdasarkan contentId
 * Optional: filter by season (?season=1)
 */
export async function getEpisodesByContent(contentId: number, season?: number) {
  try {
    const episodes = await prisma.episode.findMany({
      where: {
        content_id: contentId,
        ...(season !== undefined && { season }),
      },
      orderBy: [{ season: "asc" }, { episode_number: "asc" }],
    });

    return Response.json(episodes);
  } catch (err) {
    console.error("❌ Gagal ambil episode:", err);
    return Response.json({ error: "Gagal mengambil episode" }, { status: 500 });
  }
}

/**
 * ✅ Ambil satu episode spesifik berdasarkan ID episode dan content_id
 */
export async function getEpisodeById(contentId: number, episodeId: number) {
  try {
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
    });

    if (!episode || episode.content_id !== contentId) {
      return Response.json(
        { error: "Episode tidak ditemukan dalam konten ini" },
        { status: 404 }
      );
    }

    return Response.json(episode);
  } catch (err) {
    console.error("❌ Gagal ambil episode by ID:", err);
    return Response.json({ error: "Gagal mengambil episode" }, { status: 500 });
  }
}

/**
 * ✅ Tambah episode baru ke konten
 * Body wajib: episode_number, title
 * Optional: season (default: 0)
 */
export async function createEpisodeForContent(contentId: number, req: Request) {
  try {
    const data = await req.json();
    const { episode_number, title, season = 0 } = data;

    if (episode_number === undefined || !title) {
      return Response.json(
        { error: "Field wajib: episode_number dan title" },
        { status: 400 }
      );
    }

    const created = await prisma.episode.create({
      data: {
        content_id: contentId,
        episode_number,
        title,
        season,
      },
    });

    return Response.json(created, { status: 201 });
  } catch (err) {
    console.error("❌ Gagal membuat episode:", err);
    return Response.json({ error: "Gagal membuat episode" }, { status: 500 });
  }
}

/**
 * ✅ Update episode berdasarkan ID
 */
export async function updateEpisode(
  contentId: number,
  episodeId: number,
  req: Request
) {
  try {
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
    });

    if (!episode || episode.content_id !== contentId) {
      return Response.json(
        { error: "Episode tidak valid atau tidak ditemukan" },
        { status: 404 }
      );
    }

    const data = await req.json();
    const { title, episode_number, season } = data;

    const updated = await prisma.episode.update({
      where: { id: episodeId },
      data: {
        ...(title && { title }),
        ...(episode_number !== undefined && { episode_number }),
        ...(season !== undefined && { season }),
      },
    });

    return Response.json(updated);
  } catch (err) {
    console.error("❌ Gagal update episode:", err);
    return Response.json({ error: "Gagal update episode" }, { status: 500 });
  }
}

/**
 * ✅ Hapus episode berdasarkan ID
 */
export async function deleteEpisode(contentId: number, episodeId: number) {
  try {
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
    });

    if (!episode || episode.content_id !== contentId) {
      return Response.json(
        { error: "Episode tidak ditemukan untuk konten ini" },
        { status: 404 }
      );
    }

    await prisma.episode.delete({ where: { id: episodeId } });

    return new Response("Episode berhasil dihapus", { status: 200 });
  } catch (err) {
    console.error("❌ Gagal hapus episode:", err);
    return Response.json({ error: "Gagal hapus episode" }, { status: 500 });
  }
}
