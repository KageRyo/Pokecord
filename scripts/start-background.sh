#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_DIR="$ROOT_DIR/.runtime"
PID_FILE="$PID_DIR/pokecord.pid"
LOG_FILE="$PID_DIR/pokecord.log"
ENV_FILE="$ROOT_DIR/.env"

mkdir -p "$PID_DIR"

if [[ -f "$PID_FILE" ]]; then
  EXISTING_PID="$(cat "$PID_FILE")"

  if kill -0 "$EXISTING_PID" 2>/dev/null; then
    echo "Pokecord is already running with PID $EXISTING_PID."
    exit 0
  fi

  rm -f "$PID_FILE"
fi

cd "$ROOT_DIR"
npm run build
npm run register
set -a
source "$ENV_FILE"
set +a
setsid env \
  DISCORD_TOKEN="$DISCORD_TOKEN" \
  DISCORD_CLIENT_ID="$DISCORD_CLIENT_ID" \
  DISCORD_GUILD_ID="${DISCORD_GUILD_ID:-}" \
  node dist/index.js >>"$LOG_FILE" 2>&1 < /dev/null &
BOT_PID=$!
echo "$BOT_PID" >"$PID_FILE"

sleep 2

if kill -0 "$BOT_PID" 2>/dev/null; then
  echo "Pokecord started in background with PID $BOT_PID."
  echo "Log file: $LOG_FILE"
  exit 0
fi

echo "Pokecord failed to start. Check log: $LOG_FILE" >&2
exit 1
