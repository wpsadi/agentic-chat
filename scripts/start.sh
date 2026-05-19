#!/bin/sh
bun /app/auth-service/index.js &
bun /app/api-service/index.js &

# # main foreground process
# bun /app/web/server.js