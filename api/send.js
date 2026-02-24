export default async function handler(req, res) {
  // Только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, contact, message } = req.body;

  // Проверка данных
  if (!contact || contact.length < 2) {
    return res.status(400).json({ error: 'Invalid contact' });
  }

  if (!message || message.length < 5) {
    return res.status(400).json({ error: 'Message too short' });
  }

  // Отправка в Telegram
  const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
  const TG_CHAT_ID = process.env.TG_CHAT_ID;

  const text = `📩 *Новое сообщение с сайта!*

👤 *Имя:* ${name || 'Anonymous'}
📬 *Контакт:* ${contact}

💬 *Сообщение:*
${message}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TG_CHAT_ID,
          text: text,
          parse_mode: 'Markdown'
        })
      }
    );

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Telegram error' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
