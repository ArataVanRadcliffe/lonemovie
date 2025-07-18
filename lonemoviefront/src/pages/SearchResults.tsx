import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type Content = {
  id: number;
  title: string;
  thumbnail_url?: string;
  type: string;
};

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get("q") || "";

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/content`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((item: Content) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="px-4 py-6 text-white min-h-screen bg-black">
      <h2 className="text-2xl font-bold mb-4">🔍 Hasil untuk: "{query}"</h2>

      {loading && <p className="text-gray-400">Memuat hasil...</p>}

      {!loading && results.length === 0 && (
        <p className="text-gray-400">Tidak ditemukan konten yang cocok.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {results.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/content/${item.id}`)}
            className="cursor-pointer hover:scale-105 transition-transform duration-200"
          >
            <div className="aspect-[2/3] bg-zinc-800 rounded overflow-hidden">
              <img
                src={
                  item.thumbnail_url ||
                  "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2 text-sm text-gray-300 line-clamp-2">
              {item.title}
            </p>
            <p className="text-xs text-gray-500 capitalize">{item.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
