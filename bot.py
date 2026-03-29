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
        await self.load_extension("cogs.verification")
        await self.load_extension("cogs.roles")
        # Sync slash commands to the guild for instant updates
        guild = discord.Object(id=int(os.getenv("GUILD_ID", "0")))
        self.tree.copy_global_to(guild=guild)
        await self.tree.sync(guild=guild)
        print("✅ Slash commands synced!")

    async def on_ready(self):
        print(f"🌸 {self.user} is online and ready for Dandy's World!")
        await self.change_presence(
            activity=discord.Game(name="Dandy's World 🌺")
        )


bot = DandysBot()

if __name__ == "__main__":
    token = os.getenv("DISCORD_TOKEN")
    if not token:
        raise ValueError("❌ DISCORD_TOKEN is not set in your environment variables!")
    bot.run(token)
