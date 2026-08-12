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
import * as Hapi from '@hapi/hapi'
import * as fs from 'fs'
import { join } from 'path'
import { EventDocument } from '@opencrvs/toolkit/events'
import { importEvent } from '../../analytics/analytics'
import { getClient } from '../../analytics/postgres'
import { logger } from '@countryconfig/logger'
export interface ActionConfirmationRequest extends Hapi.Request {
  payload: EventDocument
}

export async function mapGeojsonHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const filePath = join(__dirname, './file/map.geojson')
  const fileContents = await fs.promises.readFile(filePath, 'utf8')
  return h.response(fileContents).type('text/plain')
}

function renameCauseOfDeathIntervalProperties(payload: any) {
  for (const action of payload.actions ?? []) {
    const declaration = action.declaration

    if (!declaration || typeof declaration !== 'object') {
      continue
    }

    for (const key of Object.keys(declaration)) {
      const match = key.match(
        /^eventDetails\.causeOfDeath(A|B|C|D|E|Other)\.interval$/
      )

      if (!match) {
        continue
      }

      const cause = match[1]

      const newKey = `eventDetails.causeOfDeath${cause}.symptom.one.interval`

      declaration[newKey] = declaration[key]
      delete declaration[key]
    }
  }

  return payload
}

export async function externalRecordToEncodeHandler(
  request: ActionConfirmationRequest,
  h: Hapi.ResponseToolkit
) {
  const event = request.payload
  const { countryCode } = request.params
  const { trackingId } = event

  const mappingLocation = {
    TUV: 'Tuvalu Office',
    NIU: 'Niue Office',
    TON: 'Tonga Office'
  }

  console.log(
    'Payload received by externalRecordToEncodeHandler :>> ',
    JSON.stringify(event)
  )

  // TODO: Hardcode an incoming country action to a MR_OFFICER user in this system that represents their country

  // Set deceased.certificateKey = = `EXT_$(countryCode)_$(trackingId)`
  // We want to save a row in analytics like this.  Note that it is a DECLARE row:
  const externalCertKey = `EXT_${countryCode}_${trackingId}`

  const officeName =
    mappingLocation[countryCode as keyof typeof mappingLocation] ||
    'Unknown Office'

  const dbClient = getClient()

  const spcLocation = await dbClient
    .selectFrom('analytics.locations')
    .selectAll()
    .where('name', '=', officeName)
    .execute()

  if (!spcLocation) {
    const errorMessage = `unable to find this location in analytics database.`
    // eslint-disable-next-line no-console
    console.error(errorMessage)
    logger.error(errorMessage)
  }

  if (countryCode == 'TUV') {
    // Tuvalu has a different structure for causeOfDeath intervals, so we need to rename them to match the expected structure in analytics.
    // They dont use the add another sypmtom button
    renameCauseOfDeathIntervalProperties(event)
  }

  const updatedObject = {
    ...event,
    actions: event.actions.map((action) => {
      const hasDeclaration =
        'declaration' in action && ['NOTIFY', 'DECLARE'].includes(action.type)

      if (!hasDeclaration) {
        return {
          ...action,
          createdAtLocation: spcLocation?.[0]?.id ?? action.createdAtLocation
        }
      }
      return {
        ...action,
        createdAtLocation: spcLocation?.[0]?.id ?? action.createdAtLocation,
        declaration: {
          ...action.declaration,
          'deceased.certificateKey': externalCertKey
        }
      }
    })
  }

  console.log('inserting into analytics :>> ', JSON.stringify(updatedObject))

  const client = getClient()
  try {
    await client.transaction().execute(async (trx) => {
      await importEvent(updatedObject, trx)
    })
  } catch (error) {
    const errorMessage = `Unable to import external registration into analytics database. Error: ${error}`
    // eslint-disable-next-line no-console
    console.error(errorMessage)
    logger.error(errorMessage)
    return h.response({ error: errorMessage }).code(400)
  }
  return h.response().code(200)
}
