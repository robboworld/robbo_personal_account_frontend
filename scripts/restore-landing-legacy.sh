#!/usr/bin/env sh
# Самый ранний снимок лендинга (до первого визуального обновления в репозитории).
# Запуск: npm run landing:restore:legacy
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/src/pages/Landing/Landing.jsx.before_design_refresh"
DST="$ROOT/src/pages/Landing/Landing.jsx"
if [ ! -f "$SRC" ]; then
  echo "Ошибка: нет файла-снимка $SRC" >&2
  exit 1
fi
cp "$SRC" "$DST"
echo "Готово: Landing.jsx восстановлен из before_design_refresh."
