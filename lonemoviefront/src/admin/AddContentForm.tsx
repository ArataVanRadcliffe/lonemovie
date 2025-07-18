import { useEffect, useState } from "react";
import { getGenres } from "../api/genres";

export default function AddContentForm() {
  const [form, setForm] = useState({
    title: "",
    title_english: "",
    title_japanese: "",
    description: "",
    thumbnail_url: "",
    backdrop_url: "",
    release_year: "",
    duration_minutes: "",
    num_seasons: "",
    num_episodes: "",
    type: "movie",
    actor: "",
    studios: "",
    score: "",
    season_name: "",
    subtitle: "",
  });

  const [genreIds, setGenreIds] = useState<number[]>([]);
  const [genreOptions, setGenreOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getGenres()
      .then(setGenreOptions)
      .catch(() => {
        setMessage("❌ Gagal memuat genre");
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenreToggle = (id: number) => {
    setGenreIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const fetchMovieFromTMDB = async () => {
    if (!form.title.trim()) return setMessage("❌ Judul harus diisi");

    try {
      setMessage("⏳ Mengambil data film dari TMDB...");
      const apiKey = "addbb995a00fd166e270c68816c3274d";
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=id&query=${encodeURIComponent(
          form.title
        )}`
      );
      const data = await res.json();
      if (!data.results || data.results.length === 0)
        return setMessage("❌ Film tidak ditemukan");

      const movie = data.results[0];

      const detailRes = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=en`
      );
      const detail = await detailRes.json();

      const creditRes = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}`
      );
      const credits = await creditRes.json();
      const actors = credits.cast
        ?.slice(0, 5)
        .map((c: any) => c.name)
        .join(", ");

      setForm((prev) => ({
        ...prev,
        title: detail.title || prev.title,
        title_english: detail.original_title || "",
        description: detail.overview || "",
        thumbnail_url: detail.poster_path
          ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
          : "",
        backdrop_url: detail.backdrop_path
          ? `https://image.tmdb.org/t/p/original${detail.backdrop_path}`
          : "",
        release_year: detail.release_date?.split("-")[0] || "",
        duration_minutes: detail.runtime?.toString() || "",
        score: detail.vote_average?.toString() || "",
        studios: detail.production_companies?.[0]?.name || "",
        actor: actors || "",
      }));

      setMessage("✅ Data film berhasil dimuat dari TMDB");
    } catch (err) {
      console.error("TMDB fetch error:", err);
      setMessage("❌ Gagal mengambil data dari TMDB");
    }
  };

  const fetchAnimeFromJikan = async () => {
    if (!form.title.trim()) return setMessage("❌ Judul harus diisi");

    try {
      setMessage("⏳ Mencari anime...");
      const searchRes = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
          form.title
        )}&limit=1`
      );
      const searchData = await searchRes.json();
      if (!searchData.data || searchData.data.length === 0) {
        return setMessage("❌ Anime tidak ditemukan");
      }

      const animeId = searchData.data[0].mal_id;

      setMessage("⏳ Mengambil detail anime...");
      const detailRes = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}`
      );
      const detailData = await detailRes.json();
      const anime = detailData.data;

      setForm((prev) => ({
        ...prev,
        title: anime.title || prev.title,
        title_english: anime.title_english || "",
        title_japanese: anime.title_japanese || "",
        description: anime.synopsis || "",
        thumbnail_url: anime.images?.jpg?.image_url || "",
        backdrop_url: anime.images?.webp?.large_image_url || "",
        release_year:
          anime.aired?.prop?.from?.year?.toString() ||
          anime.year?.toString() ||
          "",
        duration_minutes: anime.duration?.includes("min")
          ? anime.duration.split(" ")[0]
          : "24",
        num_episodes: anime.episodes?.toString() || "",
        num_seasons: "1",
        score: anime.score?.toString() || "",
        studios: anime.studios?.[0]?.name || "",
        season_name: anime.season?.toUpperCase() || "",
      }));

      setMessage("✅ Data anime berhasil diambil dari Jikan");
    } catch (err) {
      setMessage("❌ Gagal mengambil data dari Jikan API");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return setMessage("Tidak ada token, login dulu");

    const payload = {
      ...form,
      release_year: Number(form.release_year),
      duration_minutes: Number(form.duration_minutes),
      num_seasons: form.type !== "movie" ? Number(form.num_seasons) : 1,
      num_episodes: form.type === "movie" ? 1 : Number(form.num_episodes),
      score: Number(form.score),
      genreIds,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal tambah konten");
      setMessage("✅ Konten berhasil ditambahkan!");
      setForm({
        title: "",
        title_english: "",
        title_japanese: "",
        description: "",
        thumbnail_url: "",
        backdrop_url: "",
        release_year: "",
        duration_minutes: "",
        num_seasons: "",
        num_episodes: "",
        type: "movie",
        actor: "",
        studios: "",
        score: "",
        season_name: "",
        subtitle: "",
      });
      setGenreIds([]);
    } catch (err) {
      console.error("❌ Error saat submit:", err);
      setMessage("❌ Gagal menambahkan konten");
    }
  };

  return (
    <div className="text-white px-6 py-4">
      <h2 className="text-3xl font-semibold mb-6 text-violet-400">
        Tambah Konten
      </h2>
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-xl">
        {/* Input + tombol TMDB/Jikan */}
        <div className="flex items-center gap-2">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Judul"
            className="flex-1 bg-transparent border-b border-violet-500 px-2 py-2"
          />
          {form.type === "movie" && (
            <button
              type="button"
              onClick={fetchMovieFromTMDB}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm"
            >
              Get Movie
            </button>
          )}
          {form.type === "anime" && (
            <button
              type="button"
              onClick={fetchAnimeFromJikan}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded text-sm"
            >
              Get Anime
            </button>
          )}
        </div>

        {/* Type */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="bg-transparent border-b border-violet-500 px-2 py-2"
        >
          <option value="movie">Movie</option>
          <option value="series">Series</option>
          <option value="anime">Anime</option>
        </select>

        {form.type === "anime" && (
          <>
            <input
              name="title_english"
              value={form.title_english}
              onChange={handleChange}
              placeholder="Title English"
              className="bg-transparent border-b border-violet-500 px-2 py-2"
            />
            <input
              name="title_japanese"
              value={form.title_japanese}
              onChange={handleChange}
              placeholder="Title Japanese"
              className="bg-transparent border-b border-violet-500 px-2 py-2"
            />
          </>
        )}

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Deskripsi"
          className="bg-transparent border-b border-violet-500 px-2 py-2"
        />

        <input
          name="thumbnail_url"
          value={form.thumbnail_url}
          onChange={handleChange}
          placeholder="URL Thumbnail"
          className="bg-transparent border-b border-violet-500 px-2 py-2"
        />
        {form.thumbnail_url && (
          <img
            src={form.thumbnail_url}
            alt="Preview Thumbnail"
            className="w-24 h-36 object-cover rounded shadow"
          />
        )}

        <input
          name="backdrop_url"
          value={form.backdrop_url}
          onChange={handleChange}
          placeholder="URL Backdrop"
          className="bg-transparent border-b border-violet-500 px-2 py-2"
        />
        {form.backdrop_url && (
          <img
            src={form.backdrop_url}
            alt="Preview Backdrop"
            className="w-full h-36 object-cover rounded shadow"
          />
        )}

        <input
          name="release_year"
          value={form.release_year}
          onChange={handleChange}
          placeholder="Tahun Rilis"
          type="number"
          className="bg-transparent border-b border-violet-500 px-2 py-2"
        />
        <input
          name="duration_minutes"
          value={form.duration_minutes}
          onChange={handleChange}
          placeholder="Durasi (menit)"
          type="number"
          className="bg-transparent border-b border-violet-500 px-2 py-2"
        />
        <input
          name="actor"
          value={form.actor}
          onChange={handleChange}
          placeholder="Actor"
          className="bg-transparent border-b border-violet-500 px-2 py-2"
        />
        <input
          name="studios"
          value={form.studios}
          onChange={handleChange}
          placeholder="Studios"
          className="bg-transparent border-b border-violet-500 px-2 py-2"
        />
        <input
          name="score"
          value={form.score}
          onChange={handleChange}
          placeholder="Score (0.0 - 10.0)"
          type="number"
          step="0.1"
          className="bg-transparent border-b border-violet-500 px-2 py-2"
        />
        {form.type === "anime" && (
          <input
            name="season_name"
            value={form.season_name}
            onChange={handleChange}
            placeholder="Season (SPRING, SUMMER, FALL, WINTER)"
            className="bg-transparent border-b border-violet-500 px-2 py-2"
          />
        )}

        {form.type !== "movie" && (
          <>
            <input
              name="num_seasons"
              value={form.num_seasons}
              onChange={handleChange}
              placeholder="Jumlah Season"
              type="number"
              className="bg-transparent border-b border-violet-500 px-2 py-2"
            />
            <input
              name="num_episodes"
              value={form.num_episodes}
              onChange={handleChange}
              placeholder="Jumlah Episode"
              type="number"
              className="bg-transparent border-b border-violet-500 px-2 py-2"
            />
          </>
        )}

        {/* Genre */}
        <div>
          <p className="text-sm text-violet-300 mb-2">Pilih Genre:</p>
          <div className="flex flex-wrap gap-2">
            {genreOptions.map((genre) => (
              <button
                type="button"
                key={genre.id}
                onClick={() => handleGenreToggle(genre.id)}
                className={`px-3 py-1 rounded text-sm border ${
                  genreIds.includes(genre.id)
                    ? "bg-violet-600 border-violet-600"
                    : "bg-zinc-800 border-zinc-700"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        <input
          name="subtitle"
          value={form.subtitle}
          onChange={handleChange}
          placeholder="Subtitle (opsional)"
          className="bg-transparent border-b border-violet-500 px-2 py-2"
        />

        <button
          type="submit"
          className="bg-violet-700 hover:bg-violet-800 text-white py-2 rounded transition-all duration-200"
        >
          Simpan Konten
        </button>

        {message && <p className="text-sm mt-2 text-violet-400">{message}</p>}
      </form>
    </div>
  );
}
