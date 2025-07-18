import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = `${import.meta.env.VITE_API_URL}`;

function getToken() {
  return localStorage.getItem("token");
}

export default function EditContentForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    type: "movie",
    description: "",
    release_year: "",
    thumbnail_url: "",
    duration_minutes: "",
    num_seasons: "",
    num_episodes: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/api/content/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setForm({
          ...form,
          ...data,
          release_year: data.release_year || "",
          duration_minutes: data.duration_minutes || "",
          num_seasons: data.num_seasons || "",
          num_episodes: data.num_episodes || "",
        });
      })
      .catch((err) => {
        console.error("Gagal ambil konten:", err);
        setMessage("Gagal ambil data konten");
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API}/api/content/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Gagal update konten");
      } else {
        setMessage("✅ Konten berhasil diperbarui!");
        setTimeout(() => navigate("/admin"), 1000);
      }
    } catch (err) {
      console.error("Error update konten:", err);
      setMessage("Terjadi kesalahan.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 px-4 py-10 text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Edit Konten</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-800 p-6 rounded-lg"
        >
          <input
            type="text"
            name="title"
            placeholder="Judul"
            value={form.title}
            onChange={handleChange}
            className="bg-zinc-700 px-4 py-2 rounded w-full"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="bg-zinc-700 px-4 py-2 rounded w-full"
          >
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="anime">Anime</option>
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Deskripsi"
            rows={4}
            className="bg-zinc-700 px-4 py-2 rounded md:col-span-2 w-full"
          />

          <input
            type="text"
            name="release_year"
            placeholder="Tahun Rilis"
            value={form.release_year}
            onChange={handleChange}
            className="bg-zinc-700 px-4 py-2 rounded w-full"
          />

          <input
            type="text"
            name="thumbnail_url"
            placeholder="URL Thumbnail"
            value={form.thumbnail_url}
            onChange={handleChange}
            className="bg-zinc-700 px-4 py-2 rounded w-full"
          />

          <input
            type="text"
            name="duration_minutes"
            placeholder="Durasi (menit)"
            value={form.duration_minutes}
            onChange={handleChange}
            className="bg-zinc-700 px-4 py-2 rounded w-full"
          />

          <input
            type="text"
            name="num_seasons"
            placeholder="Jumlah Season"
            value={form.num_seasons}
            onChange={handleChange}
            className="bg-zinc-700 px-4 py-2 rounded w-full"
          />

          <input
            type="text"
            name="num_episodes"
            placeholder="Jumlah Episode"
            value={form.num_episodes}
            onChange={handleChange}
            className="bg-zinc-700 px-4 py-2 rounded w-full"
          />

          <div className="md:col-span-2 text-center">
            <button
              type="submit"
              className="bg-violet-700 hover:bg-violet-800 text-white px-6 py-2 rounded mt-2"
            >
              Simpan Perubahan
            </button>

            {message && (
              <p className="mt-2 text-sm text-violet-400">{message}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
