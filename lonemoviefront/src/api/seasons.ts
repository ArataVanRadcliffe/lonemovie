const API = `${import.meta.env.VITE_API_URL}`;

export async function getSeasons(contentId: number) {
  const res = await fetch(`${API}/api/season/${contentId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal mengambil season");
  return data.seasons;
}
