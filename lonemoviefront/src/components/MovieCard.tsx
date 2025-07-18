import { useNavigate } from "react-router-dom";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface Props {
  contents: {
    id: number;
    title: string;
    slug: string;
    thumbnail_url?: string;
  }[];
  title?: string;
}

export default function MovieCardSlider({ contents, title }: Props) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      {title && (
        <h2 className="text-xl font-semibold text-white mb-3 px-2">{title}</h2>
      )}
      <Swiper
        spaceBetween={16}
        freeMode={true}
        slidesPerView={"auto"}
        modules={[FreeMode]}
        className="px-2"
      >
        {contents.map((content) => (
          <SwiperSlide key={content.id} style={{ width: "auto" }}>
            <div
              onClick={() => navigate(`/content/${content.slug}`)}
              className="cursor-pointer w-[140px] sm:w-[160px] md:w-[180px] group shrink-0"
            >
              <div className="aspect-[2/3] bg-zinc-800 rounded overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-200">
                <img
                  src={
                    content.thumbnail_url ||
                    "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 text-sm text-gray-300 line-clamp-2">
                {content.title}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
