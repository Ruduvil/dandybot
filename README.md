# 🌸 Dandy's World Discord Bot

A Discord bot for your **Dandy's World** Roblox community with:
- ✅ Roblox account verification via Blox.link
- 🌸 Ephemeral role picker (only visible to you)
- 💾 User records stored in Supabase
- 🚀 Deployed on Railway

---

## Setup Guide

### Step 1 — Create the Discord Bot

1. Go to https://discord.com/developers/applications → **New Application**
2. Name it `Dandy's World Bot` → Create
3. Go to **Bot** tab → **Reset Token** → copy the token (save it!)
4. Enable these **Privileged Gateway Intents**:
   - ✅ Server Members Intent
5. Go to **OAuth2 → URL Generator**:
   - Scopes: `bot`, **`applications.commands`** (ESSE É O MAIS IMPORTANTE!)
   - Bot Permissions: `Manage Roles`, `Send Messages`, `Use Slash Commands`
6. Copy the generated URL → open it → invite the bot to your server

> ⚠️ The bot's role in the server must be **above** all the roles it manages in the role list!

---

### Step 2 — Get a Blox.link API Key

1. Go to https://blox.link and log in with Discord
2. Go to **Dashboard → API Keys**
3. Create a free API key and copy it

---

### Step 3 — Set Up Supabase

1. Go to https://supabase.com → **New project** (free tier is fine)
2. Go to **SQL Editor** and run this query to create the users table:

```sql
create table verified_users (
  discord_id      text primary key,
  roblox_id       text not null,
  roblox_username text not null,
  verified_at     timestamptz default now()
);
```

3. Go to **Project Settings → API**:
   - Copy the **Project URL**
   - Copy the **anon/public** key

---

**Automated Setup (NEW):**
You don't need to create these manually anymore!
1. Invite the bot to your server.
2. Run `/setup_roles`.
3. The bot will create all roles and give you the IDs for Railway.

**Manual List (if you prefer):**
- `✅ Verified` — given to everyone who verifies
... (rest of the list)

**Playstyle (pick one):**
- `🔧 Extractor`, `🏃 Distractor`, `💚 Supporter`, `🛡️ Survivalist`

**Favorite Toon (pick up to 3):**
- `⭐ Pebble`, `🚀 Astro`, `🌱 Sprout`, `🐚 Shelly`, `📱 Vee`
- `🌸 Poppy`, `📦 Boxten`, `🎨 Blot`, `💡 Brightney`, `🌊 Cosmo`
- `🐟 Finn`, `🦋 Flutter`, `🌺 Gigi`, `✨ Glisten`, `👻 Goob`
- `🎯 Looey`, `🎭 Razzle & Dazzle`, `🐭 Rodger`, `🧵 Scraps`, `🦐 Shrimpo`
- `🌟 Teagan`, `🎀 Tisha`, `🍬 Toodles`, `⚡ Yatta`

**Notifications:**
- `📢 Announcements`, `🎮 Events`, `🆕 Game Updates`, `🤝 LFG`

**Regions:**
- `🇺🇸 North America`, `🇧🇷 Brazil / SA`, `🇪🇺 Europe`, `🌏 Asia / OCE`

After creating them, right-click each role → **Copy Role ID** (enable Developer Mode in Discord settings first)

---

### Step 5 — Deploy to Railway

1. Push this project to a **GitHub repository** (make the repo private!)
2. Go to https://railway.app → **New Project → Deploy from GitHub**
3. Select your repo
4. Go to **Variables** tab and add every variable from `.env.example`:

| Variable | Where to find it |
|---|---|
| `DISCORD_TOKEN` | Discord Developer Portal → Bot |
| `GUILD_ID` | Right-click your server → Copy Server ID |
| `BLOXLINK_API_KEY` | Blox.link Dashboard |
| `SUPABASE_URL` | Supabase → Settings → API |
| `SUPABASE_KEY` | Supabase → Settings → API (anon key) |
| `VERIFIED_ROLE_ID` | Discord → right-click role → Copy Role ID |
| `ROLE_PEBBLE`, etc. | Same as above for each role |

5. Railway will auto-build and start the bot!
6. Once the bot is online, go to any channel in your server and type:
   > `/setup_roles`
   This will create all the roles for you automatically and give you a list of IDs to put in Railway!

> ✅ You'll see `🌸 Dandy's World Bot is online!` in the Railway logs when it's running.

---

### Step 6 — Set Up a Verification Channel
... (same as before)

1. Create a `#verify` channel in your server
2. Restrict it so **only unverified users can see it** (use permissions with your `@Verified` role)
3. Post a message like:
   > 🌸 **Welcome to Dandy's World!**
   > Run `/verify` to link your Roblox account and unlock the server!

---

## Commands

| Command | Description |
|---|---|
| `/verify` | Link your Roblox account and open the role picker |
| `/roles` | Open the role picker anytime to update your roles |

---

## File Structure

```
dandys-world-bot/
├── bot.py              # Entry point
├── config.py           # Role & server IDs (from env vars)
├── db.py               # Supabase database layer
├── cogs/
│   ├── verification.py # /verify command + Blox.link integration
│   └── roles.py        # /roles command + ephemeral role picker UI
├── requirements.txt
├── .env.example        # Copy to .env for local development
├── Procfile            # Railway: run as worker
└── railway.json        # Railway build config
```

---

## Adding More Features Later

- **Add new toons**: Add a new entry to `TOON_ROLES` in `config.py` + env var + Railway variable
- **Add new role categories**: Create a new Select class in `cogs/roles.py` and add to `RolePickerView`
- **Leveling / XP**: Add columns to the Supabase table and a new cog
- **Auto-unverify on kick**: Use `on_member_remove` event in bot.py
