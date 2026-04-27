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

export const appConfig = {
  discordToken: requireEnv("DISCORD_TOKEN"),
  clientId: requireEnv("DISCORD_CLIENT_ID"),
  guildId: process.env.DISCORD_GUILD_ID?.trim() || undefined
};
