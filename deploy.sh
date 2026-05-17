#!/bin/bash

# Directorio base del proyecto (un nivel arriba de server/)
BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Base dir: $BASE_DIR"

echo "Building client..."
cd "$BASE_DIR/client" && npm install && npm run build

echo "Copying to httpdocs..."
cp -r "$BASE_DIR/client/dist/"* "$BASE_DIR/httpdocs/"

echo "Installing server deps..."
cd "$BASE_DIR/server" && npm install

echo "Done! Restart Node.js from Plesk panel."