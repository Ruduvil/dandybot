"""
config.py — All server-specific IDs for the Dandy's World bot.
Replace the 0s with your actual Discord role/channel IDs.
You can also set these via environment variables instead.
"""
import os

# ── Server ────────────────────────────────────────────────────────────────────
GUILD_ID = int(os.getenv("GUILD_ID", "0"))
VERIFIED_ROLE_ID = int(os.getenv("VERIFIED_ROLE_ID", "0"))

# ── Playstyle Roles (pick one) ────────────────────────────────────────────────
PLAYSTYLE_ROLES = {
    "🔧 Extractor":    int(os.getenv("ROLE_EXTRACTOR",   "0")),
    "🏃 Distractor":   int(os.getenv("ROLE_DISTRACTOR",  "0")),
    "💚 Supporter":    int(os.getenv("ROLE_SUPPORTER",   "0")),
    "🛡️ Survivalist":  int(os.getenv("ROLE_SURVIVALIST", "0")),
}

# ── Favorite Toon Roles (pick up to 3) ───────────────────────────────────────
TOON_ROLES = {
    # ★ Main Characters
    "⭐ Pebble":           int(os.getenv("ROLE_PEBBLE",        "0")),
    "🚀 Astro":            int(os.getenv("ROLE_ASTRO",         "0")),
    "🌱 Sprout":           int(os.getenv("ROLE_SPROUT",        "0")),
    "🐚 Shelly":           int(os.getenv("ROLE_SHELLY",        "0")),
    "📱 Vee":              int(os.getenv("ROLE_VEE",           "0")),
    # ★ Side Characters
    "🌸 Poppy":            int(os.getenv("ROLE_POPPY",         "0")),
    "📦 Boxten":           int(os.getenv("ROLE_BOXTEN",        "0")),
    "🎨 Blot":             int(os.getenv("ROLE_BLOT",          "0")),
    "💡 Brightney":        int(os.getenv("ROLE_BRIGHTNEY",     "0")),
    "🌊 Cosmo":            int(os.getenv("ROLE_COSMO",         "0")),
    "🐟 Finn":             int(os.getenv("ROLE_FINN",          "0")),
    "🦋 Flutter":          int(os.getenv("ROLE_FLUTTER",       "0")),
    "🌺 Gigi":             int(os.getenv("ROLE_GIGI",          "0")),
    "✨ Glisten":          int(os.getenv("ROLE_GLISTEN",       "0")),
    "👻 Goob":             int(os.getenv("ROLE_GOOB",          "0")),
    "🎯 Looey":            int(os.getenv("ROLE_LOOEY",         "0")),
    "🎭 Razzle & Dazzle":  int(os.getenv("ROLE_RAZZLE_DAZZLE", "0")),
    "🐭 Rodger":           int(os.getenv("ROLE_RODGER",        "0")),
    "🧵 Scraps":           int(os.getenv("ROLE_SCRAPS",        "0")),
    "🦐 Shrimpo":          int(os.getenv("ROLE_SHRIMPO",       "0")),
    "🌟 Teagan":           int(os.getenv("ROLE_TEAGAN",        "0")),
    "🎀 Tisha":            int(os.getenv("ROLE_TISHA",         "0")),
    "🍬 Toodles":          int(os.getenv("ROLE_TOODLES",       "0")),
    "⚡ Yatta":            int(os.getenv("ROLE_YATTA",         "0")),
}

# ── Notification Roles (pick any) ─────────────────────────────────────────────
NOTIFICATION_ROLES = {
    "📢 Announcements": int(os.getenv("ROLE_ANNOUNCEMENTS", "0")),
    "🎮 Events":        int(os.getenv("ROLE_EVENTS",        "0")),
    "🆕 Game Updates":  int(os.getenv("ROLE_UPDATES",       "0")),
    "🤝 LFG":           int(os.getenv("ROLE_LFG",           "0")),
}

# ── Region Roles (pick one) ───────────────────────────────────────────────────
REGION_ROLES = {
    "🇺🇸 North America": int(os.getenv("ROLE_NA",   "0")),
    "🇧🇷 Brazil / SA":   int(os.getenv("ROLE_SA",   "0")),
    "🇪🇺 Europe":        int(os.getenv("ROLE_EU",   "0")),
    "🌏 Asia / OCE":     int(os.getenv("ROLE_ASIA", "0")),
}
