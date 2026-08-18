#!/bin/bash
# Fully-detached dev server starter
# Double-forks to escape the parent shell's process group

cd /home/z/my-project

# Kill any stale dev servers
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "next-server" 2>/dev/null
sleep 1

# Clear log
> /home/z/my-project/dev.log

# Start dev server fully detached
nohup setsid bash -c '
  cd /home/z/my-project
  exec bun run dev > /home/z/my-project/dev.log 2>&1
' </dev/null >/dev/null 2>&1 &

# Detach the setsid wrapper
disown -a 2>/dev/null

# Give it time to come up
sleep 8

# Report status
if ss -tlnp 2>/dev/null | grep -q ":3000"; then
  echo "DEV_SERVER_UP"
else
  echo "DEV_SERVER_DOWN"
fi
