import { useNavigate } from "react-router-dom";

interface Props {
  id: number;
  title: string;
  thumbnail_url?: string;
}

export default function SectionCard({ id, title, thumbnail_url }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/content/${id}`)}
      className="cursor-pointer w-40 sm:w-44 md:w-48 group"
    >
      <div className="aspect-[2/3] bg-zinc-800 rounded overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-200">
        <img
          src={
            thumbnail_url || "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="mt-2 text-sm text-gray-300 line-clamp-2">{title}</p>
    </div>
  );
}
