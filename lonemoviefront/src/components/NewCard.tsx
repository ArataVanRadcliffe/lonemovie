import { useNavigate } from "react-router-dom";

interface Props {
  content: {
    id: number;
    slug: string;
    title: string;
    thumbnail_url?: string;
  };
}

export default function NewCard({ content }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/content/${content.slug}`)}
      className="cursor-pointer w-[140px] sm:w-[160px] md:w-[180px] group shrink-0 transition-transform duration-300 hover:scale-105"
    >
      <div className="relative rounded overflow-hidden aspect-[2/3] bg-zinc-900 shadow-lg">
        <img
          src={
            content.thumbnail_url ||
            "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={content.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <p className="text-sm text-white font-medium truncate">
            {content.title}
          </p>
        </div>
      </div>
    </div>
  );
}
