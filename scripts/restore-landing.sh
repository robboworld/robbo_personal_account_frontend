#!/usr/bin/env sh
# Восстанавливает лендинг из последнего снимка «до премиум-обновления».
# Запуск: npm run landing:restore
# Старый снимок (до первого редизайна): npm run landing:restore:legacy
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DST="$ROOT/src/pages/Landing/Landing.jsx"
SNAP_PREMIUM="$ROOT/src/pages/Landing/Landing.jsx.before_premium_refresh"
SNAP_LEGACY="$ROOT/src/pages/Landing/Landing.jsx.before_design_refresh"

if [ ! -f "$SNAP_PREMIUM" ]; then
  echo "Ошибка: нет файла-снимка $SNAP_PREMIUM" >&2
  echo "Подсказка: для отката к самой ранней версии: npm run landing:restore:legacy" >&2
  exit 1
fi
cp "$SNAP_PREMIUM" "$DST"
echo "Готово: Landing.jsx восстановлен из before_premium_refresh."
