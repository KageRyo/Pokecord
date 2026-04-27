# Pokecord

Pokecord is a Discord bot that lets users pock each other in a server, similar to Facebook's poke feature.

## Features

- `/pock user:@someone`
  Pock another user in the server.
- `/pock-history`
  Show the latest pock records in the current server.
- `/language locale:<en|ja|zh-TW>`
  Change the bot language for the current server.
- Local JSON storage
  Records are stored in `data/pock-history.json` and language settings are stored in `data/guild-settings.json`.

## Stack

- TypeScript
- Node.js
- `discord.js`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env
```

3. Fill in these values in `.env`:

- `DISCORD_TOKEN`
- `DISCORD_CLIENT_ID`
- `DISCORD_GUILD_ID`

`DISCORD_GUILD_ID` is optional.

- If set, commands are registered to that server only, which is better for development because updates appear quickly.
- If left empty, commands are registered globally, which is better for production but can take longer to appear in Discord.

## Register Slash Commands

Run:

```bash
npm run register
```

This registers:

- `/pock`
- `/pock-history`
- `/language`

If you still see old slash commands in the current scope, run:

```bash
npm run clear-commands
```

Then register again:

```bash
npm run register
```

## Run The Bot

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Production:

```bash
npm start
```

## Project Structure

```text
src/
  commands/       Slash command handlers
  domain/         Domain models
  repositories/   Data access
  services/       Business logic
  utils/          Small shared utilities
```

## Notes

- `/pock` uses a Discord user option, so the real usage in the UI will be selecting a user rather than typing a raw username string.
- `/pock` stays public in the channel, so both the sender and the target can see it in the server.
- Pock history and language settings are currently stored in local files. This is simple and appropriate for a small bot, but it can be replaced later with SQLite or another database without changing the command flow much.
