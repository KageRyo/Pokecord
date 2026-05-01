#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="$ROOT_DIR/.runtime/pokecord.pid"
LOG_FILE="$ROOT_DIR/.runtime/pokecord.log"

if [[ ! -f "$PID_FILE" ]]; then
  echo "Pokecord is not running."
  exit 0
fi

BOT_PID="$(cat "$PID_FILE")"

if ps -p "$BOT_PID" >/dev/null 2>&1; then
  echo "Pokecord is running with PID $BOT_PID."
  echo "Log file: $LOG_FILE"
  exit 0
fi

echo "Pokecord is not running, but stale PID file exists for $BOT_PID."
exit 1
