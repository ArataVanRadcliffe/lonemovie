import { useEffect, useState } from "react";
import { getGenres } from "../api/genres";

export default function AddGenre() {
  const [name, setName] = useState("");
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [message, setMessage] = useState("");

  async function fetchGenres() {
    try {
      const list = await getGenres();
      setGenres(list.genres || list); // fallback
    } catch {
      setMessage("Gagal memuat genre");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3001/api/genre", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (res.ok) {
        setName("");
        fetchGenres();
        setMessage("✅ Genre berhasil ditambahkan!");
      } else {
        setMessage(data.error || "❌ Gagal menambahkan genre");
      }
    } catch {
      setMessage("❌ Error saat menghubungi server");
    }
  }

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <div className="text-white px-4 py-4 max-w-xl">
      <h2 className="text-2xl font-semibold text-violet-400 mb-4">
        Tambah Genre
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama Genre"
          className="px-3 py-2 rounded bg-zinc-800 text-white flex-1 border border-zinc-700 focus:outline-none focus:border-violet-500"
        />
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded text-white text-sm"
        >
          Tambah
        </button>
      </form>

      {message && <p className="text-sm mb-2 text-violet-300">{message}</p>}

      <div>
        <h3 className="font-semibold mb-2">Daftar Genre:</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          {genres.map((g) => (
            <li key={g.id} className="border-b border-zinc-700 pb-1">
              • {g.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
