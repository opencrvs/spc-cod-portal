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

export async function externalRecordToEncodeHandler(
  request: ActionConfirmationRequest,
  h: Hapi.ResponseToolkit
) {
  const event = request.payload
  const { countryCode } = request.params
  const { trackingId } = event

  console.log(
    'Payload received by externalRecordToEncodeHandler :>> ',
    JSON.stringify(event)
  )

  // TODO: Hardcode an incoming country action to a MR_OFFICER user in this system that represents their country

  // Set deceased.certificateKey = = `EXTERNAL_OPENCRVS_RECORD_$(countryCode)_$(trackingId)`
  // We want to save a row in analytics like this.  Note that it is a DECLARE row:
  const externalCertKey = `EXTERNAL_OPENCRVS_RECORD_${countryCode}_${trackingId}`

  const updatedObject = {
    ...event,
    actions: event.actions.map((action) => {
      if (!('declaration' in action)) {
        return action
      }

      if (action.type === 'DECLARE' && action.status === 'Requested') {
        return {
          ...action,
          declaration: {
            ...action.declaration,
            'deceased.certificateKey': externalCertKey
          }
        }
      }

      return action
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
