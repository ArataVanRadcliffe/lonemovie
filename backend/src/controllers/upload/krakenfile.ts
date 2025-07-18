export async function krakenfileUpload(req: Request): Promise<Response> {
  const formData = await req.formData(); // ⬅ GANTI INI
  const file = formData.get("file") as File;

  if (!file) {
    return new Response(JSON.stringify({ error: "File tidak ditemukan" }), {
      status: 400,
    });
  }

  const serverRes = await fetch("https://krakenfiles.com/api/server/available");
  const serverJson = await serverRes.json();

  const uploadURL = serverJson?.data?.url;
  const serverAccessToken = serverJson?.data?.serverAccessToken;

  if (!uploadURL || !serverAccessToken) {
    return new Response(
      JSON.stringify({ error: "Gagal dapatkan server Krakenfile" }),
      { status: 500 }
    );
  }

  const apiToken = Bun.env.KRAKENFILE_API_KEY!;

  const uploadForm = new FormData();
  uploadForm.set("file", file);
  uploadForm.set("serverAccessToken", serverAccessToken);

  const uploadRes = await fetch(uploadURL, {
    method: "POST",
    headers: {
      "X-AUTH-TOKEN": apiToken,
    },
    body: uploadForm,
  });

  const json = await uploadRes.json();

  if (!uploadRes.ok || !json.data?.url) {
    return new Response(
      JSON.stringify({ error: json?.data?.message || "Upload gagal" }),
      {
        status: 500,
      }
    );
  }

  return Response.json({
    success: true,
    url: json.data.url,
    hash: json.data.hash,
    title: json.data.title,
  });
}
