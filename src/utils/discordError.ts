export function getDiscordAuthErrorMessage(error: unknown): string | null {
  if (!(error instanceof Error)) {
    return null;
  }

  const code = "code" in error ? error.code : undefined;

  if (code === "TokenInvalid") {
    return [
      "Discord authentication failed: DISCORD_TOKEN is invalid.",
      "Use the bot token from Discord Developer Portal -> Application -> Bot -> Reset Token."
    ].join(" ");
  }

  if (code === 0 && "status" in error && error.status === 401) {
    return [
      "Discord API returned 401 Unauthorized.",
      "Check that DISCORD_TOKEN is the bot token for this application and has not been rotated."
    ].join(" ");
  }

  return null;
}
