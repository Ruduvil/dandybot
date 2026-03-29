"""
db.py — Supabase database layer for the Dandy's World bot.
Handles all read/write operations for verified users.
"""
import os
import asyncio
from datetime import datetime, timezone
from supabase import create_client, Client

_client: Client = None


def _get_client() -> Client:
    """Lazily initialize the Supabase client."""
    global _client
    if _client is None:
        url = os.getenv("SUPABASE_URL", "")
        key = os.getenv("SUPABASE_KEY", "")
        if not url or not key:
            raise ValueError("❌ SUPABASE_URL and SUPABASE_KEY must be set!")
        _client = create_client(url, key)
    return _client


async def get_verified_user(discord_id: str) -> dict | None:
    """
    Returns the verified_users row for this Discord user, or None if not found.
    """
    def _query():
        result = (
            _get_client()
            .table("verified_users")
            .select("*")
            .eq("discord_id", discord_id)
            .execute()
        )
        return result.data[0] if result.data else None

    return await asyncio.to_thread(_query)


async def save_verified_user(discord_id: str, roblox_id: str, roblox_username: str) -> None:
    """
    Inserts or updates a verified user record in Supabase.
    Uses upsert so re-verification is safe.
    """
    def _query():
        _get_client().table("verified_users").upsert({
            "discord_id":       discord_id,
            "roblox_id":        roblox_id,
            "roblox_username":  roblox_username,
            "verified_at":      datetime.now(timezone.utc).isoformat(),
        }).execute()

    await asyncio.to_thread(_query)
