#!/bin/bash

# El script vive en httpdocs/, que es la raíz real del proyecto
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Base dir: $BASE_DIR"

echo "Building client..."
cd "$BASE_DIR/client" && npm install && npm run build

echo "Copying to httpdocs..."
cp -r "$BASE_DIR/client/dist/"* "$BASE_DIR/"

echo "Installing server deps..."
cd "$BASE_DIR/server" && npm install

echo "Done! Restart Node.js from Plesk panel."