import { useNavigate } from "react-router-dom";

interface Episode {
  id: number;
  title: string;
  created_at: string;
  url: string;
}

interface Props {
  slug: string;
  title: string;
  thumbnail_url?: string;
  episodes?: Episode[];
  status?: string;
}

export default function AnimeCardWithEpisodes({
  slug,
  title,
  thumbnail_url,
  episodes = [],
  status = "Ongoing",
}: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/content/${slug}`)}
      className="bg-zinc-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer p-3 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="w-full aspect-[2/3] relative rounded overflow-hidden mb-3">
        <img
          src={
            thumbnail_url || "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Judul */}
      <h3 className="text-sm md:text-base font-semibold text-white line-clamp-2 mb-2">
        {title}
      </h3>

      {/* Episode Buttons */}
      <div className="flex flex-col gap-2">
        {episodes.slice(0, 3).map((ep) => (
          <button
            key={ep.id}
            className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs px-3 py-1 rounded text-left truncate"
            onClick={(e) => {
              e.stopPropagation(); // ⛔ agar tidak trigger navigate ke /content/:slug
              window.location.href = ep.url;
            }}
          >
            Episode {ep.id} - {ep.title}
          </button>
        ))}
      </div>

      {/* Status */}
      <div className="mt-3">
        <span className="inline-block bg-orange-600 text-white text-xs px-2 py-1 rounded">
          {status}
        </span>
      </div>
    </div>
  );
}
