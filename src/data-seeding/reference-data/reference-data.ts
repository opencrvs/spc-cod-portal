/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * OpenCRVS is also distributed under the terms of the Civil Registration
 * & Healthcare Disclaimer located at http://opencrvs.org/license.
 *
 * Copyright (C) The OpenCRVS Authors located at https://github.com/opencrvs/opencrvs-core/blob/master/AUTHORS.
 */
import { logger } from '@countryconfig/logger'
import { chunk } from 'lodash'
import { getClient } from './postgres'
import { readCSVToJSON } from '@countryconfig/utils'
import { Icd10CodeRecord } from './handler'

const INSERT_MAX_CHUNK_SIZE = 1000

export async function syncReferenceData() {
  const client = getClient()

  const icd10Records = await readCSVToJSON<Icd10CodeRecord[]>(
    './src/data-seeding/reference-data/source/specV2021SR40-Codes.csv'
  )

  await client.transaction().execute(async (trx) => {
    for (const [index, batch] of chunk(
      icd10Records,
      INSERT_MAX_CHUNK_SIZE
    ).entries()) {
      logger.info(
        `Processing ${Math.min((index + 1) * INSERT_MAX_CHUNK_SIZE, icd10Records.length)}/${icd10Records.length} icd10 codes`
      )

      await trx
        .insertInto('reference_data.icd10')
        .values(
          batch.map((l) => ({
            id: l.id,
            label: l.label,
            code: l.code,
            source: l.source
          }))
        )
        .onConflict((oc) =>
          oc.column('id').doUpdateSet((eb) => ({
            label: eb.ref('excluded.label'),
            code: eb.ref('excluded.code'),
            source: eb.ref('excluded.source')
          }))
        )
        .execute()
    }
  })
}
