import discord
from discord import app_commands
from discord.ext import commands
import os

class Setup(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(
        name="setup_roles",
        description="Automatically create all required roles for Dandy's World. (Admin Only)"
    )
    @app_commands.checks.has_permissions(manage_roles=True)
    async def setup_roles(self, interaction: discord.Interaction):
        await interaction.response.defer(ephemeral=True, thinking=True)
        
        guild = interaction.guild
        results = []
        
        # Helper to create role if missing
        async def get_or_create_role(name, color=discord.Color.default()):
            existing = discord.utils.get(guild.roles, name=name)
            if existing:
                return existing, False
            new_role = await guild.create_role(name=name, color=color, reason="Automated Dandy's World Setup")
            return new_role, True

        # 1. Core Role
        verified, created = await get_or_create_role("✅ Verified", discord.Color.green())
        results.append(f"`VERIFIED_ROLE_ID={verified.id}`")

        # 2. Playstyle Roles
        playstyles = {
            "🔧 Extractor": discord.Color.from_rgb(255, 235, 59), # Yellow
            "🏃 Distractor": discord.Color.from_rgb(255, 152, 0), # Orange
            "💚 Supporter": discord.Color.from_rgb(76, 175, 80),  # Green
            "🛡️ Survivalist": discord.Color.from_rgb(33, 150, 243) # Blue
        }
        for name, color in playstyles.items():
            role, _ = await get_or_create_role(name, color)
            var_name = name.split()[-1].upper()
            results.append(f"`ROLE_{var_name}={role.id}`")

        # 3. Favorite Toon Roles (Pink/Purple theme)
        toons = [
            "⭐ Pebble", "🚀 Astro", "🌱 Sprout", "🐚 Shelly", "📱 Vee",
            "🌸 Poppy", "📦 Boxten", "🎨 Blot", "💡 Brightney", "🌊 Cosmo",
            "🐟 Finn", "🦋 Flutter", "🌺 Gigi", "✨ Glisten", "👻 Goob",
            "🎯 Looey", "🎭 Razzle & Dazzle", "🐭 Rodger", "🧵 Scraps", "🦐 Shrimpo",
            "🌟 Teagan", "🎀 Tisha", "🍬 Toodles", "⚡ Yatta"
        ]
        toon_color = discord.Color.from_rgb(255, 110, 180) # Dandy Pink
        for name in toons:
            role, _ = await get_or_create_role(name, toon_color)
            results.append(f"`ROLE_{name.split()[-1].upper().replace('&', '').replace(' ', '_')}={role.id}`")

        # 4. Notifications
        notifs = ["📢 Announcements", "🎮 Events", "🆕 Game Updates", "🤝 LFG"]
        for name in notifs:
            role, _ = await get_or_create_role(name, discord.Color.light_grey())
            results.append(f"`ROLE_{name.split()[-1].upper()}={role.id}`")

        # 5. Regions
        regions = ["🇺🇸 North America", "🇧🇷 Brazil / SA", "🇪🇺 Europe", "🌏 Asia / OCE"]
        for name in regions:
            role, _ = await get_or_create_role(name, discord.Color.dark_blue())
            results.append(f"`ROLE_{name.split()[-1].upper()}={role.id}`")

        # Create output summary
        output = "\n".join(results)
        
        embed = discord.Embed(
            title="✅ Roles Initialized!",
            description="All roles have been created. **Copy these IDs into your Railway Variables:**",
            color=discord.Color.green()
        )
        
        # We might have too many roles to fit in one embed description (limit 4096)
        # So we'll send the list in chunks if needed or just provide the key ones.
        
        await interaction.followup.send(embed=embed, ephemeral=True)
        # Send the raw IDs in a separate message for easy copying
        for i in range(0, len(results), 20):
            await interaction.followup.send(content="\n".join(results[i:i+20]), ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(Setup(bot))
