#!/usr/bin/env bash
set -euo pipefail

# -------- ARG CHECK --------
if [[ $# -eq 0 ]] || [[ -z "${1// }" ]]; then
  echo "❌ Missing disease name"
  echo "Usage: yarn compare-icd-code \"disease name\""
  exit 1
fi

QUERY="$1"

API_BASE="http://localhost:8085/icd"
LANG="en"

# -------- SEARCH --------
SEARCH_RESPONSE=$(curl -s \
  -H "API-Version: v2" \
  -H "Accept: application/json" \
  -H "Accept-Language: $LANG" \
  "$API_BASE/entity/search?q=$(printf '%s' "$QUERY" | jq -sRr @uri)&useFlexisearch=true"
)

if [[ -z "$SEARCH_RESPONSE" ]] || ! printf '%s' "$SEARCH_RESPONSE" | jq empty >/dev/null 2>&1; then
  echo "❌ ICD API returned invalid search response"
  exit 1
fi

COUNT=$(printf '%s' "$SEARCH_RESPONSE" | jq '.destinationEntities | length')
if [[ "$COUNT" -eq 0 ]]; then
  echo "❌ No ICD entities found for: $QUERY"
  exit 0
fi

# -------- SCORE + FILTER --------
BEST=$(printf '%s' "$SEARCH_RESPONSE" | jq -r '
  .destinationEntities
  | map({
      id: .id,
      title: (.title // ""),
      chapter: (.chapter // ""),
      code: (.theCode // null),
      score: (
        (if .chapter == "25" then 3 else 0 end)
        + (if (.title | test("sepsis|failure|arrest|shock|history|screening|vaccine"; "i")) then -5 else 0 end)
        + (if .theCode != null then 2 else 0 end)
      )
    })
  | sort_by(-.score)
  | .[0]
')

SCORE=$(printf '%s' "$BEST" | jq -r '.score')
CODE=$(printf '%s' "$BEST" | jq -r '.code // empty')
TITLE=$(printf '%s' "$BEST" | jq -r '.title')

if [[ "$SCORE" -lt 1 ]]; then
  echo "❌ Unable to determine an underlying cause for: $QUERY"
  exit 0
fi

if [[ -n "$CODE" ]]; then
  echo "✅ Underlying cause determined"
  echo "Code:  $CODE"
  echo "Title: $TITLE"
  exit 0
fi

echo "⚠️ Recognized condition, but no ICD-11 code available via local API"
echo "Title: $TITLE"
