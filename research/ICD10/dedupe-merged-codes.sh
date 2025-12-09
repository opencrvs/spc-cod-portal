#!/usr/bin/env bash
set -euo pipefail

INPUT="merged-codes.csv"
OUTPUT="merged-codes.deduped.csv"

python - << 'PY'
import csv
from collections import OrderedDict

INPUT = "merged-codes.csv"
OUTPUT = "merged-codes.deduped.csv"

# Source priority: higher number = higher priority
PRIORITY = {
    "iris-dictionary": 3,
    "iris-specV202SR40": 2,
    "specV2021SR40-Codes": 2,  # adjust/alias as needed
    "who-2019": 1,
}

def sentence_case(s: str) -> str:
    s = s.strip()
    if not s:
        return s
    s_lower = s.lower()
    return s_lower[0].upper() + s_lower[1:]

# key -> (priority, row)
best = {}
# preserve first-seen order of keys
order = []

with open(INPUT, newline="", encoding="utf-8") as f_in:
    reader = csv.DictReader(f_in)
    fieldnames = reader.fieldnames
    if fieldnames is None:
        raise SystemExit("Input CSV has no header row.")

    for row in reader:
        # Normalise fields
        label = (row.get("label") or "").strip()
        code = (row.get("code") or "").strip()
        source = (row.get("source") or "").strip()

        if not label and not code:
            # skip completely blank rows
            continue

        # Case-insensitive key: (label, code)
        key = (label.lower(), code.upper())

        # Priority lookup
        p = PRIORITY.get(source, 0)

        # Keep best row per key
        if key not in best or p > best[key][0]:
            best[key] = (p, row)
            if key not in order:
                order.append(key)

with open(OUTPUT, "w", newline="", encoding="utf-8") as f_out:
    writer = csv.DictWriter(f_out, fieldnames=fieldnames)
    writer.writeheader()

    for key in order:
        _, row = best[key]

        # Ensure sentence case label in output
        label = row.get("label") or ""
        row["label"] = sentence_case(label)

        writer.writerow(row)

PY

echo "De-duplicated CSV written to: $OUTPUT"
