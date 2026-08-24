# Telegram MCP Connector Setup Guide

This connects your Telegram bot (`jackuomo_bot`) to Claude AI via MCP, enabling full automation.

## Quick Start (2 steps)

### Step 1: Deploy to Render (Free)

1. Go to https://render.com
2. Sign up (free) and create account
3. Click "New +" → "Web Service"
4. Select "Build and deploy from a Git repository"
5. Click "Public Git repository" and paste this URL:
   ```
   https://github.com/your-repo/telegram-mcp-jack
   ```
   *(Or upload the files manually)*

6. Configure environment variables:
   - `TELEGRAM_BOT_TOKEN`: `8617964886:AAEoJznp1pQrIpobivYHX_p1OkQCd6Fphb8`
   - `TELEGRAM_USER_ID`: `1868687890`
   - `ANTHROPIC_API_KEY`: *(Get from https://console.anthropic.com)*

7. Click "Deploy"

### Step 2: Connect Telegram Webhook

After deployment, you'll get a URL like `https://your-service.render.com`

Run this command in your terminal (or send to @BotFather):

```
curl -X POST https://api.telegram.org/bot8617964886:AAEoJznp1pQrIpobivYHX_p1OkQCd6Fphb8/setWebhook?url=https://your-service.render.com/webhook
```

Replace `your-service.render.com` with your actual Render URL.

---

## That's it!

Your Telegram bot is now connected to Claude. Try:
- `Help me find someone to have dinner with`
- `Check my calendar for Friday`
- `Send an email to Cindy`

---

## Alternative: Run Locally (for testing)

```bash
# Install dependencies
npm install

# Set environment variables
export TELEGRAM_BOT_TOKEN=8617964886:AAEoJznp1pQrIpobivYHX_p1OkQCd6Fphb8
export TELEGRAM_USER_ID=1868687890
export ANTHROPIC_API_KEY=your-key-here

# Run server
npm start
```

Then use ngrok to expose locally:
```bash
ngrok http 3000
# Copy the URL and use it for setWebhook
```

---

## Troubleshooting

**Bot not responding?**
- Check Render logs for errors
- Verify webhook is set: `curl https://api.telegram.org/bot{TOKEN}/getWebhookInfo`
- Make sure TELEGRAM_USER_ID is correct

**Rate limited?**
- Render free tier has some limits
- Upgrade to paid if needed

---

## What the Bot Can Do

✓ Check your Google Calendar
✓ Send emails via Gmail
✓ Find dinner companions (from memory)
✓ Create calendar events
✓ Send WhatsApp/Telegram messages (after confirmation)
✓ Answer questions about your schedule

All completely free via Telegram!
