import { useEffect, useState } from "react";
import { getContents } from "../api/contents";

// Tipe konten & episode
type Content = {
  id: number;
  slug: string;
  title: string;
  type: "movie" | "series" | "anime";
};

type Episode = {
  id: number;
  episode_number: number;
  title: string;
};

export default function AddEpisode() {
  const [contents, setContents] = useState<Content[]>([]);
  const [filtered, setFiltered] = useState<Content[]>([]);
  const [search, setSearch] = useState("");
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisodeForSource, setSelectedEpisodeForSource] = useState<
    number | null
  >(null);
  const [newSource, setNewSource] = useState({
    provider: "",
    url720: "",
    url1080: "",
  });

  const [episode, setEpisode] = useState({ episode_number: "", title: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    getContents().then(setContents);
  }, []);

  useEffect(() => {
    setFiltered(
      contents.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, contents]);

  useEffect(() => {
    if (!selectedContent) return;
    fetchEpisodes(selectedContent.slug);
  }, [selectedContent]);

  const fetchEpisodes = async (slug: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/content/slug/${slug}/episode`
      );
      const data = await res.json();
      setEpisodes(data);
    } catch (err) {
      console.error("Gagal fetch episode:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setMessage("");

    if (!selectedContent) return setMessage("Konten belum dipilih");
    if (!episode.title || !episode.episode_number)
      return setMessage("Judul dan nomor episode wajib diisi");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/content/slug/${
          selectedContent.slug
        }/episode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            episode_number: Number(episode.episode_number),
            title: episode.title,
          }),
        }
      );

      const resText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(resText);
      } catch {}

      if (!res.ok) {
        return setMessage(data?.error || resText || "Gagal membuat episode");
      }

      setMessage("✅ Episode berhasil ditambahkan!");
      setEpisode({ episode_number: "", title: "" });
      fetchEpisodes(selectedContent.slug);
    } catch (err) {
      console.error("Gagal menambahkan episode:", err);
      setMessage("❌ Gagal menambahkan episode");
    }
  };

  const handleAddSourceToEpisode = async () => {
    if (!selectedContent || !selectedEpisodeForSource) return;
    const token = localStorage.getItem("token");
    const { provider, url720, url1080 } = newSource;

    if (!provider || !url720 || !url1080) {
      return setMessage("Semua field source wajib diisi");
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/content/slug/${
          selectedContent.slug
        }/episode/${selectedEpisodeForSource}/sources`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            provider,
            priority: 0,
            qualities: [
              { resolution: "720p", url: url720 },
              { resolution: "1080p", url: url1080 },
            ],
          }),
        }
      );

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {}

      if (!res.ok) {
        return setMessage(data?.error || text || "Gagal menambahkan source");
      }

      setMessage("✅ Source berhasil ditambahkan!");
      setNewSource({ provider: "", url720: "", url1080: "" });
      setSelectedEpisodeForSource(null);
      fetchEpisodes(selectedContent.slug);
    } catch (err) {
      console.error("Gagal menambahkan source:", err);
      setMessage("Terjadi kesalahan saat menambahkan source");
    }
  };

  return (
    <div className="text-white p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Tambah Episode</h2>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari konten..."
        className="bg-zinc-800 px-3 py-2 rounded w-full mb-2"
      />

      {filtered.length > 0 && (
        <ul className="bg-zinc-800 rounded divide-y divide-zinc-700 max-h-40 overflow-y-auto mb-4">
          {filtered.map((c) => (
            <li
              key={c.id}
              onClick={() => {
                setSelectedContent(c);
                setSearch(c.title);
              }}
              className="p-2 hover:bg-violet-700 cursor-pointer"
            >
              {c.title} ({c.type})
            </li>
          ))}
        </ul>
      )}

      {selectedContent && (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={episode.episode_number}
              onChange={(e) =>
                setEpisode({ ...episode, episode_number: e.target.value })
              }
              placeholder="Nomor Episode"
              type="number"
              className="bg-zinc-800 px-3 py-2 rounded w-full"
            />

            <input
              value={episode.title}
              onChange={(e) =>
                setEpisode({ ...episode, title: e.target.value })
              }
              placeholder="Judul Episode"
              className="bg-zinc-800 px-3 py-2 rounded w-full"
            />

            <button
              type="submit"
              className="bg-violet-700 text-white px-4 py-2 rounded hover:bg-violet-800"
            >
              Simpan Episode
            </button>
          </form>

          {episodes.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-2">📺 Daftar Episode:</h3>
              <ul className="space-y-2">
                {episodes.map((ep) => (
                  <li
                    key={ep.id}
                    className="bg-zinc-800 p-3 rounded hover:bg-zinc-700 cursor-pointer"
                    onClick={() => setSelectedEpisodeForSource(ep.id)}
                  >
                    Episode {ep.episode_number}: {ep.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedEpisodeForSource && (
            <div className="bg-zinc-900 p-4 rounded mt-4 space-y-3">
              <h4 className="font-semibold">
                Tambah Source ke Episode ID: {selectedEpisodeForSource}
              </h4>

              <input
                placeholder="Nama Provider"
                value={newSource.provider}
                onChange={(e) =>
                  setNewSource({ ...newSource, provider: e.target.value })
                }
                className="bg-zinc-800 px-3 py-2 rounded w-full"
              />

              <input
                placeholder="URL 720p"
                value={newSource.url720}
                onChange={(e) =>
                  setNewSource({ ...newSource, url720: e.target.value })
                }
                className="bg-zinc-800 px-3 py-2 rounded w-full"
              />

              <input
                placeholder="URL 1080p"
                value={newSource.url1080}
                onChange={(e) =>
                  setNewSource({ ...newSource, url1080: e.target.value })
                }
                className="bg-zinc-800 px-3 py-2 rounded w-full"
              />

              <button
                onClick={handleAddSourceToEpisode}
                type="button"
                className="bg-violet-700 text-white px-4 py-2 rounded hover:bg-violet-800"
              >
                Simpan Source
              </button>
            </div>
          )}
        </>
      )}

      {message && <p className="text-violet-400 text-sm mt-4">{message}</p>}
    </div>
  );
}
