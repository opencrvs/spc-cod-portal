import { getClient } from './postgres'
import Hapi from '@hapi/hapi'

export interface Icd10CodeRecord {
  id: string
  label: string
  code: string
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
    .select(['code', 'label'])
    .where((eb) =>
      eb.or([eb('code', 'ilike', codePrefix), eb('label', 'ilike', likeTerm)])
    )
    .limit(50)
    .execute()

  const codes = rows.map((r) => r.code)
  const displays = rows.map((r) => [r.code, r.label]) // uuid + label to be returned instead

  return h.response([codes, displays]).code(200)
}
