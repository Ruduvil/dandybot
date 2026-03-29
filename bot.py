import discord
from discord.ext import commands
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

intents = discord.Intents.default()
intents.members = True


class DandysBot(commands.Bot):
    def __init__(self):
        super().__init__(command_prefix="!", intents=intents)

    async def setup_hook(self):
        await self.load_extension("cogs.setup")
        await self.load_extension("cogs.verification")
        await self.load_extension("cogs.roles")
        
        # ── Instant Sync for Guild ───────────────────────────────────────────
        guild_id_str = os.getenv("GUILD_ID", "0")
        if guild_id_str != "0":
            guild = discord.Object(id=int(guild_id_str))
            self.tree.copy_global_to(guild=guild)
            await self.tree.sync(guild=guild)
            print(f"✅ Slash commands synced instantly to Guild ID: {guild_id_str}!")
        else:
            # Fallback to global sync (can take ~1 hour update)
            await self.tree.sync()
            print("⚠️ GUILD_ID not set. Slash commands synced GLOBALLY. (May take 1 hour to appear)")

    async def on_ready(self):
        print(f"🌸 {self.user} is online and ready for Dandy's World!")
        await self.change_presence(
            activity=discord.Game(name="Dandy's World 🌺")
        )

    # 🔧 Manual force-sync if needed: type '!sync' in Discord
    @commands.command()
    @commands.is_owner()
    async def sync(self, ctx):
        await ctx.send("🔄 Syncing slash commands...")
        await self.tree.sync()
        if os.getenv("GUILD_ID", "0") != "0":
            guild = discord.Object(id=int(os.getenv("GUILD_ID")))
            self.tree.copy_global_to(guild=guild)
            await self.tree.sync(guild=guild)
        await ctx.send("✅ Done! If they still don't appear, check your bot invitation scopes.")


bot = DandysBot()

if __name__ == "__main__":
    token = os.getenv("DISCORD_TOKEN")
    if not token:
        raise ValueError("❌ DISCORD_TOKEN is not set in your environment variables!")
    bot.run(token)
