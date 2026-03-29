"""
cogs/roles.py — Role picker UI and /roles slash command for Dandy's World bot.
Shows an ephemeral message with Select menus for each role category.
"""
import discord
from discord import app_commands
from discord.ext import commands
import config


# ── Helpers ───────────────────────────────────────────────────────────────────

def build_options(
    role_dict: dict[str, int],
    member_role_ids: set[int],
) -> list[discord.SelectOption]:
    """
    Build a list of SelectOptions from a role_dict, marking roles the member
    already has as selected (default=True).
    Skips any role with ID 0 (not configured yet).
    """
    options = []
    for name, role_id in role_dict.items():
        if role_id == 0:
            continue
        options.append(
            discord.SelectOption(
                label=name,
                value=str(role_id),
                default=(role_id in member_role_ids),
            )
        )
    return options


def placeholder_option() -> list[discord.SelectOption]:
    """Fallback when no roles are configured yet."""
    return [discord.SelectOption(label="⚙️ Not configured yet", value="0")]


# ── Select Menus ──────────────────────────────────────────────────────────────

class PlaystyleSelect(discord.ui.Select):
    def __init__(self, member_role_ids: set[int]):
        options = build_options(config.PLAYSTYLE_ROLES, member_role_ids)
        super().__init__(
            placeholder="⚔️ Pick your playstyle...",
            min_values=0,
            max_values=1,
            options=options or placeholder_option(),
            row=0,
        )

    async def callback(self, interaction: discord.Interaction):
        # Defer silently — roles are applied when Save is clicked
        await interaction.response.defer()


class ToonSelect(discord.ui.Select):
    def __init__(self, member_role_ids: set[int]):
        options = build_options(config.TOON_ROLES, member_role_ids)
        super().__init__(
            placeholder="🌸 Pick your favorite Toon(s) — up to 3...",
            min_values=0,
            max_values=min(3, max(len(options), 1)),
            options=options or placeholder_option(),
            row=1,
        )

    async def callback(self, interaction: discord.Interaction):
        await interaction.response.defer()


class NotificationSelect(discord.ui.Select):
    def __init__(self, member_role_ids: set[int]):
        options = build_options(config.NOTIFICATION_ROLES, member_role_ids)
        super().__init__(
            placeholder="🔔 Pick which pings you want...",
            min_values=0,
            max_values=max(len(options), 1),
            options=options or placeholder_option(),
            row=2,
        )

    async def callback(self, interaction: discord.Interaction):
        await interaction.response.defer()


class RegionSelect(discord.ui.Select):
    def __init__(self, member_role_ids: set[int]):
        options = build_options(config.REGION_ROLES, member_role_ids)
        super().__init__(
            placeholder="🌍 Pick your region...",
            min_values=0,
            max_values=1,
            options=options or placeholder_option(),
            row=3,
        )

    async def callback(self, interaction: discord.Interaction):
        await interaction.response.defer()


# ── Save Button ───────────────────────────────────────────────────────────────

class SaveButton(discord.ui.Button):
    def __init__(self):
        super().__init__(
            label="💾  Save My Roles!",
            style=discord.ButtonStyle.success,
            row=4,
        )

    async def callback(self, interaction: discord.Interaction):
        view: RolePickerView = self.view  # type: ignore
        member = interaction.user
        guild = interaction.guild

        await interaction.response.defer(ephemeral=True, thinking=True)

        # ── Collect all role IDs the user just chose ──────────────────────────
        chosen_ids: set[int] = set()
        for child in view.children:
            if isinstance(child, discord.ui.Select):
                for val in child.values:
                    rid = int(val)
                    if rid != 0:
                        chosen_ids.add(rid)

        # ── All managed role IDs across every category ────────────────────────
        all_managed: set[int] = set()
        for category in [
            config.PLAYSTYLE_ROLES,
            config.TOON_ROLES,
            config.NOTIFICATION_ROLES,
            config.REGION_ROLES,
        ]:
            for rid in category.values():
                if rid != 0:
                    all_managed.add(rid)

        # ── Compute diff ──────────────────────────────────────────────────────
        current_ids = {r.id for r in member.roles}
        roles_to_add: list[discord.Role] = []
        roles_to_remove: list[discord.Role] = []

        for role_id in all_managed:
            role = guild.get_role(role_id)
            if role is None:
                continue
            if role_id in chosen_ids and role_id not in current_ids:
                roles_to_add.append(role)
            elif role_id not in chosen_ids and role_id in current_ids:
                roles_to_remove.append(role)

        # ── Apply changes ─────────────────────────────────────────────────────
        if roles_to_add:
            await member.add_roles(*roles_to_add, reason="Role picker")
        if roles_to_remove:
            await member.remove_roles(*roles_to_remove, reason="Role picker")

        # ── Response embed ────────────────────────────────────────────────────
        embed = discord.Embed(
            title="✅ Roles Updated!",
            color=discord.Color.from_str("#a8edbb"),
        )

        if roles_to_add:
            embed.add_field(
                name="➕ Added",
                value="\n".join(f"<@&{r.id}>" for r in roles_to_add),
                inline=True,
            )
        if roles_to_remove:
            embed.add_field(
                name="➖ Removed",
                value="\n".join(f"<@&{r.id}>" for r in roles_to_remove),
                inline=True,
            )
        if not roles_to_add and not roles_to_remove:
            embed.description = "No changes — your roles are already up to date!"
        else:
            embed.description = "Your roles have been saved. Run `/roles` anytime to update them."

        embed.set_footer(text="Only you can see this • Dandy's World 🌺")
        await interaction.followup.send(embed=embed, ephemeral=True)
        view.stop()


# ── View ──────────────────────────────────────────────────────────────────────

class RolePickerView(discord.ui.View):
    def __init__(self, member: discord.Member):
        super().__init__(timeout=300)  # 5 minute window
        role_ids = {r.id for r in member.roles}
        self.add_item(PlaystyleSelect(role_ids))
        self.add_item(ToonSelect(role_ids))
        self.add_item(NotificationSelect(role_ids))
        self.add_item(RegionSelect(role_ids))
        self.add_item(SaveButton())

    async def on_timeout(self):
        # Disable all items after timeout
        for item in self.children:
            item.disabled = True  # type: ignore


# ── Helper callable from verification.py ──────────────────────────────────────

async def show_role_picker(interaction: discord.Interaction) -> None:
    """Send the ephemeral role picker to the user."""
    member = interaction.guild.get_member(interaction.user.id)
    view = RolePickerView(member)

    embed = discord.Embed(
        title="🌸 Dandy's World — Role Picker",
        description=(
            "Customize your profile! Make your picks below then press **Save**.\n\n"
            "⚔️ **Playstyle** — How do you play?\n"
            "🌺 **Favorite Toon** — Who's your fav? *(up to 3)*\n"
            "🔔 **Notifications** — What pings do you want?\n"
            "🌍 **Region** — Where in the world are you?"
        ),
        color=discord.Color.from_str("#ff6eb4"),
    )
    embed.set_footer(text="Only you can see this • Changes apply when you click Save 💾")

    await interaction.followup.send(embed=embed, view=view, ephemeral=True)


# ── Cog ───────────────────────────────────────────────────────────────────────

class Roles(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(
        name="roles",
        description="Open the role picker to customize your server roles!",
    )
    async def roles(self, interaction: discord.Interaction):
        await interaction.response.defer(ephemeral=True, thinking=True)

        member = interaction.guild.get_member(interaction.user.id)
        verified_role = interaction.guild.get_role(config.VERIFIED_ROLE_ID)

        # Gate behind verification
        if verified_role and verified_role not in member.roles:
            embed = discord.Embed(
                title="🔒 You're Not Verified Yet!",
                description=(
                    "You need to verify your Roblox account before picking roles.\n\n"
                    "Run `/verify` to get started — it only takes a second!"
                ),
                color=discord.Color.from_str("#ff6b6b"),
            )
            await interaction.followup.send(embed=embed, ephemeral=True)
            return

        await show_role_picker(interaction)


async def setup(bot: commands.Bot):
    await bot.add_cog(Roles(bot))
