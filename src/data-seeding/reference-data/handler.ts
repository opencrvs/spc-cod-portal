import { getClient } from './postgres'
import Hapi from '@hapi/hapi'

export interface Icd10CodeRecord {
  id: string
  label: string
  code: string
  source: string
}

// Source priority ranking
const SOURCE_PRIORITY: Record<string, number> = {
  'iris-dictionary': 1,
  'specV2021SR40-Codes': 2,
  'who-2019': 3
}

export async function onSearchHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const db = getClient()

  const terms = (request.query['terms'] as string)?.trim()

  if (!terms) {
    return h.response({ error: "Missing 'terms' parameter" }).code(400)
  }

  // Normalize input
  const likeTerm = `%${terms}%`
  const codePrefix = `${terms.toUpperCase()}%`

  const rows = await db
    .selectFrom('icd10')
    .select(['code', 'label', 'source'])
    .where((eb) =>
      eb.or([eb('code', 'ilike', codePrefix), eb('label', 'ilike', likeTerm)])
    )
    .limit(50)
    .execute()

  // Apply source priority ordering in app layer
  const sorted = rows.sort((a, b) => {
    const pa = SOURCE_PRIORITY[a.source] ?? 999
    const pb = SOURCE_PRIORITY[b.source] ?? 999

    if (pa !== pb) return pa - pb
    return a.code.localeCompare(b.code)
  })

  const codes = sorted.map((r) => r.code)
  const displays = sorted.map((r) => [r.code, r.label])

  return h.response([codes, displays]).code(200)
}
