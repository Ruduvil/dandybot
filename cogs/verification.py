"""
cogs/verification.py — Roblox verification via Blox.link for Dandy's World bot.

Flow:
  1. User runs /verify
  2. Bot checks Supabase — if already in DB, skip API and show role picker
  3. Calls Blox.link API to find the user's linked Roblox account
  4. Fetches the Roblox username
  5. Saves to Supabase, grants Verified role, shows role picker
"""
import discord
from discord import app_commands
from discord.ext import commands
import aiohttp
import os
import config
import db
from cogs.roles import show_role_picker

BLOXLINK_API_URL = "https://api.blox.link/v4/public/discord-to-roblox/{}"
ROBLOX_USER_URL  = "https://users.roblox.com/v1/users/{}"


class Verification(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(
        name="verify",
        description="Link your Roblox account to unlock the server!",
    )
    async def verify(self, interaction: discord.Interaction):
        await interaction.response.defer(ephemeral=True, thinking=True)

        member = interaction.guild.get_member(interaction.user.id)
        verified_role = interaction.guild.get_role(config.VERIFIED_ROLE_ID)

        # ── 1. Already in the database? ───────────────────────────────────────
        existing = await db.get_verified_user(str(interaction.user.id))
        if existing:
            # Make sure they still have the verified role (they might have lost it)
            if verified_role and verified_role not in member.roles:
                await member.add_roles(verified_role, reason="Re-verification: already in DB")

            embed = discord.Embed(
                title="✅ You're Already Verified!",
                description=(
                    f"Welcome back, **{existing['roblox_username']}**! 👋\n"
                    "Opening your role picker now..."
                ),
                color=discord.Color.from_str("#7eca9c"),
            )
            embed.set_footer(text="Only you can see this • Dandy's World 🌺")
            await interaction.followup.send(embed=embed, ephemeral=True)
            await show_role_picker(interaction)
            return

        # ── 2. Call Blox.link to look up the Roblox ID ───────────────────────
        api_key = os.getenv("BLOXLINK_API_KEY", "")
        if not api_key:
            await interaction.followup.send(
                "⚠️ Bot configuration error: Blox.link API key is missing. Contact an admin!",
                ephemeral=True,
            )
            return

        headers = {"Authorization": api_key}

        async with aiohttp.ClientSession() as session:

            # ── Blox.link: Discord ID → Roblox ID ────────────────────────────
            async with session.get(
                BLOXLINK_API_URL.format(interaction.user.id),
                headers=headers,
            ) as resp:
                if resp.status != 200:
                    embed = discord.Embed(
                        title="❌ Roblox Account Not Linked!",
                        description=(
                            "Your Discord account isn't connected to Roblox yet.\n\n"
                            "**Here's how to fix it:**\n"
                            "1. Go to 👉 **https://blox.link**\n"
                            "2. Log in with your Discord account\n"
                            "3. Link your Roblox account\n"
                            "4. Come back and run `/verify` again!\n\n"
                            "*It's free and only takes 30 seconds.* 🌸"
                        ),
                        color=discord.Color.from_str("#ff6b6b"),
                    )
                    embed.set_footer(text="Only you can see this • Dandy's World 🌺")
                    await interaction.followup.send(embed=embed, ephemeral=True)
                    return

                data = await resp.json()
                roblox_id = data.get("robloxID")

            # ── Roblox API: Roblox ID → Username ─────────────────────────────
            async with session.get(ROBLOX_USER_URL.format(roblox_id)) as resp:
                if resp.status == 200:
                    user_data = await resp.json()
                    roblox_username = user_data.get("name", f"User#{roblox_id}")
                else:
                    roblox_username = f"RobloxUser#{roblox_id}"

        # ── 3. Save to Supabase ───────────────────────────────────────────────
        await db.save_verified_user(
            discord_id=str(interaction.user.id),
            roblox_id=str(roblox_id),
            roblox_username=roblox_username,
        )

        # ── 4. Grant Verified role ────────────────────────────────────────────
        if verified_role:
            await member.add_roles(verified_role, reason=f"Verified as {roblox_username}")

        # ── 5. Success message + role picker ─────────────────────────────────
        embed = discord.Embed(
            title="🌸 Verification Complete!",
            description=(
                f"Welcome to Dandy's World, **{roblox_username}**! 🎉\n"
                "You've been verified. Now let's set up your roles!"
            ),
            color=discord.Color.from_str("#7eca9c"),
        )
        embed.set_footer(text="Verified via Blox.link • Only you can see this 🌺")
        await interaction.followup.send(embed=embed, ephemeral=True)

        # Show the role picker right after verification
        await show_role_picker(interaction)


async def setup(bot: commands.Bot):
    await bot.add_cog(Verification(bot))
