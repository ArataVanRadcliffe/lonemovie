export async function pixeldrainUpload(req: Request): Promise<Response> {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("❌ File tidak ditemukan dalam formData");
      return new Response(JSON.stringify({ error: "File tidak ditemukan" }), {
        status: 400,
      });
    }

    console.log("📦 File diterima:", file.name, file.type);

    const apiKey = Bun.env.PIXELDRAIN_API_KEY!;
    const buffer = await file.arrayBuffer();

    console.log("📤 Mengirim ke Pixeldrain...");

    const res = await fetch("https://pixeldrain.com/api/file", {
      method: "PUT",
      headers: {
        Authorization: "Basic " + btoa(":" + apiKey),
        "Content-Type": "application/octet-stream",
        Accept: "application/json", // ✅ bantu supaya Pixeldrain balas JSON
      },
      body: buffer,
    });

    const rawText = await res.text();

    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error("❌ Response bukan JSON:", rawText);
      return new Response(
        JSON.stringify({
          error: "Pixeldrain tidak mengembalikan JSON",
          raw: rawText,
        }),
        { status: 500 }
      );
    }

    console.log("✅ Respon dari Pixeldrain:", data);

    if (!res.ok || !data?.id) {
      return new Response(
        JSON.stringify({ error: data.message || "Upload gagal", raw: data }),
        {
          status: 500,
        }
      );
    }

    return Response.json({
      success: true,
      id: data.id,
      url: `https://pixeldrain.com/u/${data.id}`, // ✅ link hasil upload
    });
  } catch (err: any) {
    console.error("🔥 Upload ke Pixeldrain gagal:", err);
    return new Response(
      JSON.stringify({ error: "INTERNAL ERROR", detail: err.message }),
      { status: 500 }
    );
  }
}
