const API = `${import.meta.env.VITE_API_URL}`;

function getToken() {
  return localStorage.getItem("token");
}

// ✅ GET semua konten (public atau admin)
export async function getContents() {
  const res = await fetch(`${API}/api/content`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal mengambil konten");
  return data;
}

// ✅ POST /api/content → tambah konten
export async function addContent(content: any) {
  const res = await fetch(`${API}/api/content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(content),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal menambah konten");
  return data;
}

// 🔁 OPTIONAL: kalau kamu punya endpoint PUT /api/content/:id
export async function updateContent(id: number, content: any) {
  const res = await fetch(`${API}/api/content/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(content),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal memperbarui konten");
  return data;
}

// 🔁 OPTIONAL: kalau kamu punya endpoint DELETE /api/content/:id
export async function deleteContent(id: number) {
  const res = await fetch(`${API}/api/content/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Gagal menghapus konten");
}
