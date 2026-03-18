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

  const likeTerm = `%${terms}%`

  try {
    const rows = await db
      .selectFrom('icd10')
      .select(['id', 'label'])
      .where((eb) => eb('label', 'ilike', likeTerm))
      .limit(50)
      .execute()

    return h.response({ results: rows }).code(200)
  } catch (err) {
    request.log(['error'], err)
    return h.response({ error: 'Internal server error' }).code(500)
  }
}
