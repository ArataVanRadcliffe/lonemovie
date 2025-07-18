import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getContents } from "../api/contents";

// ❌ Komentar karena belum dipakai
// const API = `${import.meta.env.VITE_API_URL}`;

// ❌ Komentar karena belum digunakan, tapi disimpan untuk nanti
// type EpisodeSource = {
//   id: number;
//   episode_number: number;
//   title: string;
//   sources: {
//     id: number;
//     provider: string;
//     qualities: {
//       id: number;
//       resolution: string;
//       url: string;
//     }[];
//   }[];
// };

// ❌ Komentar fungsi fetch episode + source (jika dibutuhkan nanti)
// async function getEpisodeSourcesForContent(contentId: number) {
//   const res = await fetch(`${API}/api/content/${contentId}/episodes-sources`);
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.error || "Gagal ambil sources");
//   return data;
// }

type Content = {
  id: number;
  title: string;
  type: "movie" | "series" | "anime";
  genres?: string[];
  thumbnail_url?: string;
};

export default function ListContent() {
  const [category, setCategory] = useState<Content["type"]>("movie");
  const [contents, setContents] = useState<Content[]>([]);

  // ❌ Komentar untuk ekspansi source/episode
  // const [expandedId, setExpandedId] = useState<number | null>(null);
  // const [sourcesMap, setSourcesMap] = useState<Record<number, EpisodeSource[]>>({});

  const navigate = useNavigate();

  useEffect(() => {
    getContents().then((all: Content[]) => {
      const filtered = all.filter((c: Content) => c.type === category);
      setContents(filtered);
    });
  }, [category]);

  // ❌ Komentar toggle expand episode/source
  /*
  const toggleExpand = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!sourcesMap[id]) {
      try {
        const episodeSources = await getEpisodeSourcesForContent(id);
        setSourcesMap((prev) => ({ ...prev, [id]: episodeSources }));
      } catch (err) {
        console.error("❌ Gagal ambil source:", err);
      }
    }
  };
  */

  return (
    <div className="px-4 space-y-6">
      {/* Tabs kategori */}
      <div className="flex gap-2 mb-4">
        {["movie", "series", "anime"].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat as Content["type"]);
              // setExpandedId(null); ❌ sudah dikomentari
            }}
            className={`px-4 py-1 rounded text-sm font-medium ${
              category === cat
                ? "bg-violet-600 text-white"
                : "bg-zinc-700 hover:bg-zinc-600 text-gray-300"
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Grid konten */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {contents.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-800 rounded-lg overflow-hidden shadow-md flex flex-col"
          >
            <img
              src={
                item.thumbnail_url ||
                "https://via.placeholder.com/320x180?text=No+Image"
              }
              alt={item.title}
              className="w-full h-44 object-cover"
            />

            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-400">
                  {item.genres?.join(", ") || "Belum ada genre"}
                </p>
                <p className="text-xs text-gray-500 capitalize">{item.type}</p>
              </div>

              <button
                onClick={() => navigate(`/admin/edit/${item.id}`)}
                className="mt-4 bg-violet-600 hover:bg-violet-700 text-white px-4 py-1 rounded text-sm w-fit"
              >
                Edit Konten
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
