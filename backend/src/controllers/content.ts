import { PrismaClient, content_season_name } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

// Enum yang valid untuk season_name
const validSeasons = ["spring", "summer", "fall", "winter"] as const;

// Fungsi bantu untuk validasi dan konversi enum
function formatSeasonName(
  name: string | undefined
): content_season_name | null {
  if (typeof name !== "string") return null;
  const lower = name.toLowerCase();
  return validSeasons.includes(lower as any)
    ? (lower as content_season_name)
    : null;
}

// Ambil semua konten
export async function getAllContents() {
  try {
    const contents = await prisma.content.findMany({
      include: {
        contentgenre: { include: { genre: true } },
        subtitle: true,
        episode: {
          orderBy: { created_at: "desc" },
          take: 3, // ✅ Ambil maksimal 3 episode terbaru
        },
      },
      orderBy: { created_at: "desc" },
    });

    const formatted = contents.map((c) => ({
      ...c,
      genres: c.contentgenre.map((cg) => cg.genre.name),
      episodes: c.episode.map((e) => ({
        id: e.id,
        title: e.title || `Episode ${e.episode_number}`,
        created_at: e.created_at, // bisa diformat di frontend
        url: `/content/${c.slug}?ep=${e.id}`, // opsional: link ke episode
      })),
    }));

    return Response.json(formatted);
  } catch (err) {
    console.error("🔥 Gagal get konten:", err);
    return Response.json({ error: "Gagal ambil konten" }, { status: 500 });
  }
}

// Ambil satu konten by ID
export async function getContentById(contentId: number) {
  try {
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        contentgenre: { include: { genre: true } },
        subtitle: true,
      },
    });

    if (!content) {
      return Response.json(
        { error: "Konten tidak ditemukan" },
        { status: 404 }
      );
    }

    return Response.json({
      ...content,
      genres: content.contentgenre.map((cg) => cg.genre.name),
    });
  } catch (err) {
    console.error("🔥 Gagal ambil konten:", err);
    return Response.json({ error: "Gagal ambil konten" }, { status: 500 });
  }
}

// Ambil konten by slug
export async function getContentBySlug(slug: string) {
  try {
    const content = await prisma.content.findUnique({
      where: { slug },
      include: {
        contentgenre: { include: { genre: true } },
        subtitle: true,
      },
    });

    if (!content) {
      return Response.json(
        { error: "Konten tidak ditemukan" },
        { status: 404 }
      );
    }

    return Response.json({
      ...content,
      genres: content.contentgenre.map((cg) => cg.genre.name),
    });
  } catch (err) {
    console.error("🔥 Gagal ambil konten by slug:", err);
    return Response.json({ error: "Gagal ambil konten" }, { status: 500 });
  }
}

// Tambah konten baru
export async function createContent(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      title_english,
      title_japanese,
      description,
      type,
      release_year,
      thumbnail_url,
      backdrop_url,
      video_url,
      duration_minutes,
      num_seasons,
      num_episodes,
      studios,
      actor,
      score,
      season_name,
      subtitle,
      genreIds,
    } = body;

    if (!title || !type) {
      return Response.json(
        { error: "Judul dan tipe wajib diisi" },
        { status: 400 }
      );
    }

    const generatedSlug = slugify(title, { lower: true, strict: true });

    const existingSlug = await prisma.content.findUnique({
      where: { slug: generatedSlug },
    });

    if (existingSlug) {
      return Response.json(
        { error: "Slug sudah digunakan, ubah judul atau buat slug unik" },
        { status: 400 }
      );
    }

    const finalSeasonName = formatSeasonName(season_name);

    const content = await prisma.content.create({
      data: {
        title,
        slug: generatedSlug,
        title_english,
        title_japanese,
        description,
        type,
        release_year,
        thumbnail_url,
        backdrop_url,
        video_url,
        duration_minutes,
        num_seasons,
        num_episodes,
        studios,
        actor,
        score,
        season_name: finalSeasonName,
        contentgenre: {
          create:
            genreIds?.map((id: number) => ({
              genre: { connect: { id } },
            })) || [],
        },
        ...(Array.isArray(subtitle) && subtitle.length > 0
          ? {
              subtitle: {
                create: subtitle.map((s: any) => ({
                  language: s.language,
                  file_url: s.url,
                })),
              },
            }
          : {}),
      },
      include: {
        contentgenre: { include: { genre: true } },
        subtitle: true,
      },
    });

    return Response.json(content, { status: 201 });
  } catch (err) {
    console.error("🔥 Gagal tambah konten:", err);
    return Response.json(
      { error: "Gagal menambahkan konten" },
      { status: 500 }
    );
  }
}

// Update konten
export async function updateContent(contentId: number, req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      title_english,
      title_japanese,
      description,
      type,
      release_year,
      thumbnail_url,
      backdrop_url,
      video_url,
      duration_minutes,
      num_seasons,
      num_episodes,
      studios,
      actor,
      score,
      season_name,
    } = body;

    const updatedSlug = slugify(title, { lower: true, strict: true });

    const existing = await prisma.content.findFirst({
      where: {
        slug: updatedSlug,
        NOT: { id: contentId },
      },
    });

    if (existing) {
      return Response.json(
        { error: "Slug dari judul ini sudah digunakan" },
        { status: 400 }
      );
    }

    const finalSeasonName = formatSeasonName(season_name);

    const updated = await prisma.content.update({
      where: { id: contentId },
      data: {
        title,
        slug: updatedSlug,
        title_english,
        title_japanese,
        description,
        type,
        release_year,
        thumbnail_url,
        backdrop_url,
        video_url,
        duration_minutes,
        num_seasons,
        num_episodes,
        studios,
        actor,
        score,
        season_name: finalSeasonName,
      },
    });

    return Response.json(updated);
  } catch (err) {
    console.error("🔥 Gagal update konten:", err);
    return Response.json({ error: "Gagal update konten" }, { status: 500 });
  }
}

// Hapus konten
export async function deleteContent(contentId: number) {
  try {
    await prisma.content.delete({
      where: { id: contentId },
    });

    return new Response("Konten berhasil dihapus", { status: 200 });
  } catch (err) {
    console.error("🔥 Gagal hapus konten:", err);
    return Response.json({ error: "Gagal hapus konten" }, { status: 500 });
  }
}
