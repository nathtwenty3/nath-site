export default async function handler(req, res) {
    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_TOKEN || !CHAT_ID) {
        return res.status(500).json({ error: "Missing Telegram credentials" });
    }
    
    try {
        const message = req.query.message || req.body?.message;
        if (!message || message.trim() === "") {
            return res.status(400).json({ error: "No message provided" });
        }

        const telegramURL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

        const response = await fetch(telegramURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                chat_id: CHAT_ID, 
                text: message,
                parse_mode: "Markdown"
            }),
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
            console.error("Telegram API Error:", data);
            
            return res.status(502).json({
                success: false,
                error: data.description || "Telegram API failed"
            });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error sending message to Telegram:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
}
