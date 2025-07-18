// src/admin/Dashboard.tsx
import { useEffect, useState } from "react";
import AddContentForm from "./AddContentForm";
import AddEpisode from "./AddEpisode";
import ListContent from "./ListContent";
import UploadForm from "./UploadForm";

type Tab = "add" | "source" | "list" | "edit" | "member" | "upload";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("add");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || user.role !== "admin") {
      window.location.href = "/login";
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-zinc-900 p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("add")}
            className={buttonStyle(activeTab === "add")}
          >
            🎬 Add Konten
          </button>
          <button
            onClick={() => setActiveTab("source")}
            className={buttonStyle(activeTab === "source")}
          >
            📝 Add Source
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={buttonStyle(activeTab === "list")}
          >
            📂 List Konten
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={buttonStyle(activeTab === "edit")}
          >
            ✏️ Edit Konten
          </button>
          <button
            onClick={() => setActiveTab("member")}
            className={buttonStyle(activeTab === "member")}
          >
            👥 Member
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={buttonStyle(activeTab === "upload")}
          >
            📤 Upload File
          </button>

          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 rounded bg-red-600 hover:bg-red-700 mt-6"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* KONTEN */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "add" && (
          <>
            <h2 className="text-2xl font-bold mb-4">🎬 Tambah Konten</h2>
            <AddContentForm />
          </>
        )}

        {activeTab === "source" && (
          <>
            <h2 className="text-2xl font-bold mb-4">
              📝 Tambah Episode + Source
            </h2>
            <AddEpisode />
          </>
        )}

        {activeTab === "list" && (
          <>
            <h2 className="text-2xl font-bold mb-4">📂 Daftar Konten</h2>
            <ListContent />
          </>
        )}

        {activeTab === "edit" && (
          <>
            <h2 className="text-2xl font-bold mb-4">✏️ Edit Konten</h2>
            <p className="text-gray-400">
              ➡️ Pilih dari List Konten untuk mengedit.
            </p>
          </>
        )}

        {activeTab === "member" && (
          <>
            <h2 className="text-2xl font-bold mb-4">👥 Manajemen Member</h2>
            <p className="text-gray-400">📌 Fitur ini akan dikembangkan.</p>
          </>
        )}

        {activeTab === "upload" && (
          <>
            <h2 className="text-2xl font-bold mb-4">📤 Upload ke File Host</h2>
            <UploadForm />
          </>
        )}
      </main>
    </div>
  );
}

function buttonStyle(active: boolean) {
  return `block w-full text-left px-4 py-2 rounded transition ${
    active ? "bg-violet-600" : "hover:bg-zinc-800"
  }`;
}
