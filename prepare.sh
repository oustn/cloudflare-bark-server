#!/usr/bin/env bash

set +e

# Create wrangler.toml file
cp ./wrangler.example.toml ./wrangler.toml

if [ -n "$CUSTOM_DOMAIN" ]; then
  echo "route = { pattern = \"${CUSTOM_DOMAIN}\", custom_domain = true }" >> ./wrangler.toml
fi

if [ -n "$D1_DB" ] && [ -n "$D1_NAME" ]; then
  echo -e "\n[[d1_databases]]\nbinding = \"DB\"\ndatabase_name = \"$D1_NAME\"\ndatabase_id = \"$D1_DB\"\nmigrations_dir = \"src/migrations\"" >> ./wrangler.toml
fi

if [ "$PERSIST" = "true" ]; then
  echo -e "\n[vars]\nPERSIST = true" >> ./wrangler.toml
fi

cat ./wrangler.toml

if [ -n "$D1_DB" ] && [ -n "$D1_NAME" ]; then
  wrangler d1 migrations apply "$D1_NAME" --remote
fi
