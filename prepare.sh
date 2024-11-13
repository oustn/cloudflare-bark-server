#!/usr/bin/env bash

set +e

# Create wrangler.toml file
content=$(< ./wrangler.example.toml)

new_content="$content"

if [ -n "$CUSTOM_DOMAIN" ]; then
  new_content+="\nroute = { pattern = \"${CUSTOM_DOMAIN}\", custom_domain = true }"
fi

if [ -n "$D1_DB" ] && [ -n "$D1_NAME" ]; then
  new_content+="\n[[d1_databases]]\nbinding = \"DB\"\ndatabase_name = \"$D1_NAME\"\ndatabase_id = \"$D1_DB\"\nmigrations_dir = \"src/migrations\""
fi

if [ "$PERSIST" = "true" ]; then
  new_content+="\n[vars]\nPERSIST = true"
fi

# if wrangler not exists
echo "$new_content"

if [ ! -f ./wrangler.toml ]; then
  echo -e "$new_content" > ./wrangler.toml
  exit 0
fi

if [ -n "$D1_DB" ] && [ -n "$D1_NAME" ]; then
  wrangler d1 migrations apply "$D1_NAME" --remote
fi
