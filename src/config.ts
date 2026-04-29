import { config as loadEnv } from "dotenv";

loadEnv();

type RequiredEnvKey = "DISCORD_TOKEN" | "DISCORD_CLIENT_ID";

function requireEnv(key: RequiredEnvKey): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export const appConfig = {
  discordToken: requireEnv("DISCORD_TOKEN"),
  clientId: requireEnv("DISCORD_CLIENT_ID"),
  guildId: process.env.DISCORD_GUILD_ID?.trim() || undefined,
  maxPockHistoryPerGuild: parsePositiveInteger(process.env.POCK_HISTORY_MAX_PER_GUILD, 500)
};
