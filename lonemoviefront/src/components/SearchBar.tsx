import { Search } from "lucide-react"; // pastikan kamu sudah install lucide-react
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ContentItem = {
  id: number;
  title: string;
  slug?: string;
  thumbnail_url?: string;
};

type Props = {
  contents: ContentItem[];
};

export default function SearchBar({ contents }: Props) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<ContentItem[]>([]);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) {
      setFiltered([]);
      return;
    }

    const matches = contents.filter((c) =>
      c.title.toLowerCase().includes(val.toLowerCase())
    );
    setFiltered(matches.slice(0, 6));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelect = (item: ContentItem) => {
    navigate(item.slug ? `/content/${item.slug}` : `/content/${item.id}`);
  };

  return (
    <div className="relative max-w-2xl mx-auto mb-10 px-4">
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Cari anime, movie, series..."
          className="w-full pl-10 pr-4 py-3 rounded-full bg-zinc-900 text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
        />
      </div>

      {filtered.length > 0 && (
        <ul className="absolute z-20 w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl max-h-64 overflow-y-auto">
          {filtered.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              className="flex items-center gap-3 p-3 hover:bg-violet-600/40 cursor-pointer transition-all"
            >
              <img
                src={
                  item.thumbnail_url ||
                  "https://via.placeholder.com/60x90?text=No+Img"
                }
                alt={item.title}
                className="w-12 h-16 object-cover rounded"
              />
              <span className="text-white font-medium">{item.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
