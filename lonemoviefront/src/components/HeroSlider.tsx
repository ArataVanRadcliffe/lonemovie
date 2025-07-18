import { Autoplay, Pagination } from "swiper/modules";
import { Swiper as SwiperReact, SwiperSlide } from "swiper/react";

type SlideItem = {
  id: number;
  slug: string;
  title: string;
  description?: string;
  backdrop_url?: string;
};

interface Props {
  items: SlideItem[];
}

export default function HeroSlider({ items }: Props) {
  return (
    <div className="w-full max-h-[550px] aspect-video overflow-hidden rounded-lg">
      <SwiperReact
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        className="h-full"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              onClick={() => (window.location.href = `/content/${item.slug}`)}
              className="relative w-full h-full cursor-pointer group"
            >
              <img
                src={
                  item.backdrop_url ||
                  "https://via.placeholder.com/1280x720?text=No+Image"
                }
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-transparent to-transparent opacity-60 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
              <div className="absolute bottom-6 left-6 z-20 max-w-3xl text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-2">
                  {item.title}
                </h2>
                {item.description && (
                  <p className="text-sm md:text-base text-white drop-shadow-md line-clamp-3">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </SwiperReact>
    </div>
  );
}
