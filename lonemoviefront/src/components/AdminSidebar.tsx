// src/admin/components/AdminSidebar.tsx
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { path: "/admin/add", label: "🎬 Add Konten" },
  { path: "/admin/source", label: "📝 Add Source" },
  { path: "/admin/list", label: "📂 List Konten" },
  { path: "/admin/edit", label: "✏️ Edit Konten" },
  { path: "/admin/member", label: "👥 Member" },
  { path: "/admin/upload", label: "📤 Upload File" }, // ✅ Tambahan
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-zinc-900 text-white p-6 space-y-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <nav className="space-y-2">
        {menuItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`block px-4 py-2 rounded transition ${
              location.pathname.startsWith(path)
                ? "bg-violet-600"
                : "hover:bg-zinc-800"
            }`}
          >
            {label}
          </Link>
        ))}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          className="block w-full text-left px-4 py-2 rounded bg-red-600 hover:bg-red-700 mt-6"
        >
          🚪 Logout
        </button>
      </nav>
    </aside>
  );
}
