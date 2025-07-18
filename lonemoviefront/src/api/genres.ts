const API = `${import.meta.env.VITE_API_URL}`;

export async function getGenres() {
  const res = await fetch(`${API}/api/genre`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Gagal mengambil genre");

  return data.genres;
}
