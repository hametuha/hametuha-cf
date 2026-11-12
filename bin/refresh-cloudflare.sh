#!/usr/bin/env bash
#
# Cloudflare の Custom Error Pages のうち、GitHub Pages を指しているものを
# 再取得させる（ダッシュボードの "Fetch custom page again" 相当）。
#
# Usage: bin/refresh-cloudflare.sh <built_dir>
#
# Env:
#   CLOUDFLARE_API_TOKEN  Zone > Custom Pages > Edit 権限を持つトークン
#   CLOUDFLARE_ZONE_ID    対象ゾーンのID
#   PAGES_URL             GitHub Pages のURL（末尾スラッシュ付き）
#   CF_API_BASE           （テスト用）APIのベースURL
#
# Cloudflare が古いHTMLを取り込まないよう、GitHub Pages の配信内容が
# ビルド結果と一致するまで待ってから更新する。
set -euo pipefail

BUILT_DIR="${1:?Usage: $0 <built_dir>}"
: "${CLOUDFLARE_API_TOKEN:?}" "${CLOUDFLARE_ZONE_ID:?}"
PAGES_URL="${PAGES_URL:-https://hametuha.github.io/hametuha-cf/}"
API="${CF_API_BASE:-https://api.cloudflare.com/client/v4}/zones/${CLOUDFLARE_ZONE_ID}/custom_pages"

cf() {
	curl -fsS -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" -H "Content-Type: application/json" "$@"
}

# 1. GitHub Pages を指しているページを列挙
targets=$(cf "$API" | jq -r --arg base "$PAGES_URL" \
	'.result[] | select(.state == "customized" and (.url // "" | startswith($base))) | "\(.id) \(.url)"')

if [ -z "$targets" ]; then
	echo "No custom pages point to ${PAGES_URL}."
	exit 0
fi

# 2. 配信内容がビルド結果と一致するまで待つ
wait_for_deploy() {
	local url="$1" file="$2" i
	for i in $(seq 1 20); do
		if curl -fsS "${url}?nocache=$(date +%s)" | cmp -s - "$file"; then
			return 0
		fi
		echo "  waiting for ${url} to be updated (${i}/20)..."
		sleep 15
	done
	echo "::error::${url} does not match the build output."
	return 1
}

# 3. 同じURLで更新し、再取得させる
failed=0
while read -r id url; do
	file="${BUILT_DIR}/${url#"$PAGES_URL"}"
	echo "[${id}] ${url}"
	if [ ! -f "$file" ]; then
		echo "::warning::${file} is not in the build output. Skipped."
		continue
	fi
	if ! wait_for_deploy "$url" "$file"; then
		failed=1
		continue
	fi
	body=$(jq -n --arg url "$url" '{state: "customized", url: $url}')
	cf -X PUT "${API}/${id}" --data "$body" | jq -c '.result | {id, url, modified_on}'
done <<< "$targets"

exit "$failed"
