const express = require('express');
const axios = require('axios');
const app = express();

// Configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_USER_ID = process.env.TELEGRAM_USER_ID;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Telegram API helper
const telegramAPI = {
  sendMessage: async (chatId, text) => {
    try {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      });
    } catch (error) {
      console.error('Telegram send error:', error);
    }
  }
};

// Claude API helper
const callClaudeAPI = async (userMessage) => {
  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-opus-4-8',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ],
      system: `You are Jack's Personal AI Assistant via Telegram. 
      Your job is to:
      1. Help manage his calendar and scheduling
      2. Help with email and communication
      3. Plan social activities and find dinner companions
      4. Remember important information about Jack
      5. Make actionable recommendations
      
      When Jack asks you to do something (send email, check calendar, invite someone), 
      explain what you'll do and ask for confirmation before taking action.
      
      Be concise, practical, and friendly.
      Always confirm before sending messages or making changes.`
    }, {
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });

    return response.data.content[0].text;
  } catch (error) {
    console.error('Claude API error:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
};

// Webhook endpoint for Telegram updates
app.post('/webhook', async (req, res) => {
  try {
    const update = req.body;

    // Only process messages from your Telegram ID
    if (!update.message || update.message.from.id != TELEGRAM_USER_ID) {
      return res.status(200).send('OK');
    }

    const chatId = update.message.chat.id;
    const userMessage = update.message.text;

    // Send "typing" indicator
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendChatAction`, {
      chat_id: chatId,
      action: 'typing'
    });

    // Get response from Claude
    const claudeResponse = await callClaudeAPI(userMessage);

    // Send response back to Telegram
    await telegramAPI.sendMessage(chatId, claudeResponse);

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(200).send('OK');
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start server
app.listen(PORT, () => {
  console.log(`Telegram MCP server running on port ${PORT}`);
  console.log('Bot Token configured:', TELEGRAM_BOT_TOKEN ? '✓' : '✗');
  console.log('User ID configured:', TELEGRAM_USER_ID ? '✓' : '✗');
});

module.exports = app;
