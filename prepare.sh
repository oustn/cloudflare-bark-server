#!/usr/bin/env bash

set +e

# Create wrangler.toml file
touch ./wrangler.toml

if [ -n "$CUSTOM_DOMAIN" ]; then
  echo "route = { pattern = \"${CUSTOM_DOMAIN}\", custom_domain = true }" >> ./wrangler.toml
fi

cat ./wrangler.example.toml >> ./wrangler.toml

if [ -n "$D1_ID" ] && [ -n "$D1_NAME" ]; then
  echo -e "\n[[d1_databases]]\nbinding = \"DB\"\ndatabase_name = \"$D1_NAME\"\ndatabase_id = \"$D1_ID\"\nmigrations_dir = \"src/migrations\"" >> ./wrangler.toml
fi

if [ "$PERSIST" = "true" ]; then
  echo -e "\n[vars]\nPERSIST = true" >> ./wrangler.toml
fi

sed -e "s/$D1_NAME/***/g" < ./wrangler.toml | sed -e "s/$D1_ID/***/g" | sed -e "s/$CUSTOM_DOMAIN/***/g"

if [ -n "$D1_ID" ] && [ -n "$D1_NAME" ]; then
  yes | npx wrangler d1 migrations apply "$D1_NAME" --remote
fi
