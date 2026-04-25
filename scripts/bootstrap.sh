#!/bin/bash
set -e
echo "🚀 Bootstrapping Blind Side..."
docker compose up -d
echo "⏳ Waiting for Postgres..."
for i in {1..30}; do
  if docker compose exec -T postgres pg_isready -U blindside -d blindside > /dev/null 2>&1; then
    echo "✓ Postgres ready"; break
  fi
  sleep 1
done
pnpm prisma db push
pnpm prisma db seed
echo "✅ Done. Run 'pnpm dev' to start."
