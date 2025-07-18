// src/admin/UploadForm.tsx
import { useState } from "react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [host, setHost] = useState("pixeldrain");
  const [resultUrl, setResultUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return setError("Pilih file terlebih dahulu.");
    setLoading(true);
    setResultUrl("");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`http://localhost:3001/api/upload/${host}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Upload gagal");

      setResultUrl(data.url);
    } catch (err: any) {
      setError(err.message || "Gagal upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-800 p-6 rounded max-w-xl space-y-4">
      <div>
        <label className="block mb-1 text-sm">Pilih File:</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="bg-zinc-700 p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm">Pilih Host:</label>
        <select
          value={host}
          onChange={(e) => setHost(e.target.value)}
          className="bg-zinc-700 p-2 rounded w-full"
        >
          <option value="pixeldrain">Pixeldrain</option>
          <option value="krakenfile">Krakenfile</option>
        </select>
      </div>

      <button
        onClick={handleUpload}
        className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded text-white"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {resultUrl && (
        <p className="text-green-400 text-sm break-all">
          ✅ Link:{" "}
          <a href={resultUrl} target="_blank" className="underline">
            {resultUrl}
          </a>
        </p>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
