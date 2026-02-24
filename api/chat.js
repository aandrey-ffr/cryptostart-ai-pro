export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: message
      }),
    });

    const data = await openaiResponse.json();

    // 👇 если OpenAI вернул ошибку — увидим её в логах
    if (!openaiResponse.ok) {
      console.error("OpenAI API Error:", data);
      return res.status(500).json({ error: "OpenAI API error", details: data });
    }

    const reply =
      data.output?.[0]?.content?.[0]?.text ||
      "AI не смог сформировать ответ.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Server crash:", error);
    return res.status(500).json({ error: "Server crashed" });
  }
}
