#!/bin/bash

# Cargar nodenv para que npm esté disponible
export PATH="$HOME/.nodenv/shims:$HOME/.nodenv/bin:$PATH"
eval "$(nodenv init -)" 2>/dev/null || true

# Forzar la versión 20 explícitamente
export NODENV_VERSION=20

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Base dir: $BASE_DIR"

echo "Building client..."
cd "$BASE_DIR/client"
rm -rf node_modules package-lock.json
npm install
npm run build

echo "Copying to httpdocs..."
cp -r "$BASE_DIR/client/dist/"* "$BASE_DIR/"

echo "Installing server deps..."
cd "$BASE_DIR/server"
npm install

echo "Done! Restart Node.js from Plesk panel."