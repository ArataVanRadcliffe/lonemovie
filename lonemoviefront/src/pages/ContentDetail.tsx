import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API = `${import.meta.env.VITE_API_URL}`;

export default function DetailContent() {
  const { slug } = useParams();
  const [content, setContent] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<any | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const contentRes = await fetch(`${API}/api/content/slug/${slug}`);
        const contentData = await contentRes.json();
        setContent(contentData);

        if (contentData?.id) {
          const episodeRes = await fetch(
            `${API}/api/content/${contentData.id}/episode`
          );
          const episodeData = await episodeRes.json();
          setEpisodes(episodeData);

          if (episodeData.length > 0) {
            const firstEpisode = episodeData[0];
            setSelectedEpisode(firstEpisode);
            fetchSources(contentData.id, firstEpisode.id);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("🔥 Error fetching detail:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const fetchSources = async (contentId: number, episodeId: number) => {
    try {
      const res = await fetch(
        `${API}/api/content/${contentId}/episode/${episodeId}/sources`
      );
      const data = await res.json();
      setSources(data);

      // Kumpulkan dan proses semua kualitas
      const allQualities = data.flatMap((src: any) => {
        if (src.provider === "PD") {
          return (src.qualities || []).map((q: any) => {
            const match = q.url.match(/pixeldrain\.com\/u\/([a-zA-Z0-9]+)/);
            const fileId = match ? match[1] : null;
            return {
              ...q,
              url: fileId
                ? `https://pixeldrain.com/api/file/${fileId}?stream=true`
                : q.url,
            };
          });
        }
        return src.qualities || [];
      });

      // Urutkan berdasarkan resolusi
      const sorted = allQualities.sort(
        (a: any, b: any) => parseInt(b.resolution) - parseInt(a.resolution)
      );

      if (sorted.length > 0) {
        setSelectedUrl(sorted[0].url);
      } else {
        setSelectedUrl(null);
      }
    } catch (err) {
      console.error("❌ Error fetching sources:", err);
    }
  };

  const changeEpisode = (ep: any) => {
    setSelectedEpisode(ep);
    if (content?.id) {
      fetchSources(content.id, ep.id);
    }
  };

  if (loading) return <p className="text-white p-4">Loading...</p>;
  if (!content) return <p className="text-white p-4">Konten tidak ditemukan</p>;

  return (
    <div className="bg-black text-white px-4 pb-12 space-y-8">
      {/* Video Player */}
      <div className="w-full flex justify-center overflow-hidden">
        <iframe
          src={
            !selectedUrl
              ? "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              : selectedUrl.includes("youtube.com")
              ? `${selectedUrl}?autoplay=1`
              : selectedUrl
          }
          allow="autoplay; fullscreen"
          allowFullScreen
          scrolling="no"
          className="w-full max-w-6xl aspect-video rounded-lg shadow-lg overflow-hidden border-0"
          title="Video Player"
        />
      </div>

      {/* Tombol Resolusi per Provider */}
      {sources.length > 0 && (
        <div className="space-y-3">
          {sources.map((source, i) => (
            <div key={i}>
              <p className="text-sm text-gray-300 mb-1">{source.provider}</p>
              <div className="flex flex-wrap gap-2">
                {(source.qualities || [])
                  .map((q: any) => {
                    if (source.provider === "PD") {
                      const match = q.url.match(
                        /pixeldrain\.com\/u\/([a-zA-Z0-9]+)/
                      );
                      const fileId = match ? match[1] : null;
                      return {
                        ...q,
                        url: fileId
                          ? `https://pixeldrain.com/api/file/${fileId}?stream=true`
                          : q.url,
                      };
                    }
                    return q;
                  })
                  .sort(
                    (a: any, b: any) =>
                      parseInt(b.resolution) - parseInt(a.resolution)
                  )
                  .map((q: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedUrl(q.url)}
                      className={`px-3 py-1 rounded text-sm border ${
                        selectedUrl === q.url
                          ? "bg-violet-700 border-violet-400"
                          : "bg-zinc-800 border-zinc-600 hover:bg-zinc-700"
                      }`}
                    >
                      {q.resolution}p
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Info */}
      <div>
        <h1 className="text-3xl font-bold mb-1">{content.title}</h1>
        <p className="text-sm text-gray-300 mb-2">{content.description}</p>
        <p className="text-sm text-gray-400">
          Tahun: {content.release_year || "-"} | Durasi:{" "}
          {content.duration_minutes || "-"} menit |{" "}
          {content.genres?.join(", ") || "Tidak ada genre"}
        </p>
      </div>

      {/* Episode List */}
      {episodes.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Episode</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {episodes.map((ep) => (
              <li
                key={ep.id}
                onClick={() => changeEpisode(ep)}
                className={`cursor-pointer p-2 rounded border text-center text-sm ${
                  selectedEpisode?.id === ep.id
                    ? "bg-violet-700 border-violet-500"
                    : "bg-zinc-800 hover:bg-zinc-700 border-zinc-600"
                }`}
              >
                Episode {ep.episode_number}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
