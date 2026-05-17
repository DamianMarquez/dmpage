#!/bin/bash
echo "Building client..."
cd client && npm install && npm run build
cp -r dist/* ../httpdocs/

echo "Installing server deps..."
cd ../server && npm install

echo "Done! Restart Node.js from Plesk panel."