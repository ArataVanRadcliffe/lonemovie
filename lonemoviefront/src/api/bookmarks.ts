const API = `${import.meta.env.VITE_API_URL}`;

function getToken() {
  return localStorage.getItem("token");
}

export async function getBookmarks() {
  const res = await fetch(`${API}/api/bookmarks`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal mengambil bookmark");
  return data.bookmarks;
}

export async function addBookmark(contentId: number) {
  const res = await fetch(`${API}/api/bookmarks/${contentId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal menambahkan bookmark");
  return data;
}

export async function deleteBookmark(contentId: number) {
  const res = await fetch(`${API}/api/bookmarks/${contentId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal menghapus bookmark");
  return data;
}
