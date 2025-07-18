import "keen-slider/keen-slider.min.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import AnimeCardWithEpisodes from "../components/AnimeCard";
import HeroSlider from "../components/HeroSlider";
import NewCard from "../components/NewCard";
import SearchBar from "../components/SearchBar";

type Episode = {
    id: number;
    title: string;
    created_at: string;
    url: string;
};

type Content = {
    id: number;
    slug: string;
    title: string;
    thumbnail_url?: string;
    backdrop_url?: string;
    type: "movie" | "series" | "anime";
    genres?: string[];
    episodes?: Episode[];
};

export default function Home() {
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/content`)
            .then((res) => res.json())
            .then((data) => {
                setContents(data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Gagal ambil konten:", err);
                setLoading(false);
            });
    }, []);

    const recent = contents.slice(0, 6);
    const movies = contents.filter((c) => c.type === "movie");
    const animes = contents.filter((c) => c.type === "anime");

    if (loading) {
        return (
            <div className="bg-black text-white px-4 pb-16 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black text-white px-4 pb-16">
            {/* 🔍 Search */}
            <div className="pt-6">
                <SearchBar contents={contents} />
            </div>

            {/* 🎞️ SLIDER */}
            <div className="mb-12">
                <HeroSlider items={contents.slice(0, 4)} />
            </div>

            {/* 🆕 Baru ditambahkan */}
            <section className="mb-14">
                <h3 className="text-xl font-bold mb-4">🆕 Baru-baru ini ditambahkan</h3>
                <div className="px-2">
                    <Swiper
                        spaceBetween={16}
                        freeMode={true}
                        slidesPerView={"auto"}
                        modules={[FreeMode]}
                    >
                        {recent.map((c) => (
                            <SwiperSlide key={c.id} style={{ width: "auto" }}>
                                <NewCard content={c} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* 🎬 Movie List */}
            <section className="mb-14">
                <h3 className="text-xl font-bold mb-4">🎬 List Movie</h3>
                <Swiper
                    spaceBetween={16}
                    freeMode={true}
                    slidesPerView={"auto"}
                    modules={[FreeMode]}
                    className="px-1"
                >
                    {movies.map((content) => (
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
            </section>

            {/* 🌀 Anime List */}
            <section className="mb-14">
                <h3 className="text-xl font-bold mb-4">🌀 List Anime</h3>
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                    {animes.map((anime) => (
                        <AnimeCardWithEpisodes
                            key={anime.id}
                            slug={anime.slug}
                            title={anime.title}
                            thumbnail_url={anime.thumbnail_url}
                            episodes={anime.episodes || []}
                            status="Ongoing"
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}