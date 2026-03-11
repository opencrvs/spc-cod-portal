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
import { defaultQueries } from './queries'
import {
  EventDocument,
  ActionDocument,
  ActionStatus
} from '@opencrvs/toolkit/events'
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

export async function dashboardQueriesHandler(
  _: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  return h.response(defaultQueries())
}

export async function externalRecordToEncodeHandler(
  request: ActionConfirmationRequest,
  h: Hapi.ResponseToolkit
) {
  const event = request.payload

  // const { countryCode } = request.params
  // TODO: Get the trackingId out of the incoming event declaration
  // Hardcode an incoming country action to a MR_OFFICER user in this system that represents their country

  // Set deceased.certificateKey = = `EXTERNAL_OPENCRVS_RECORD_$(countryCode)_$(trackingId)`
  // We want to save a row in analytics like this.  Note that it is a DECLARE row:

  /*

  FYI: this is what the event looks like in the analytics database after being imported:


[
	{
		"event_type": "death",
		"action_type": "DECLARE",
		"annotation": {
		},
		"assigned_to": null,
		"created_at": "2026-03-09 21:52:27.113+00",
		"created_at_location": "",
		"created_by": "",
		"created_by_role": "MR_OFFICER",
		"created_by_signature": null,
		"created_by_user_type": "user",
		"declared_at": "2026-03-09 21:52:27.013+00",
		"registered_at": "2026-03-09 22:24:06.397+00",
		"declaration": {
			"deceased_dob": "1920-06-21",
			"deceased_gender": "2",
			"deceased_address": {
				"country": "FAR",
				"addressType": "DOMESTIC",
				"administrativeArea": "aa462095-bc05-42cb-9ade-a46eac19a5f4",
				"streetLevelDetails": {
				}
			},
			"deceased_eventDate": "2025-07-26",
			"deceased_certificateKey": "FIJ-0001",
			"eventDetails_antecedentCause2": {
				"label": "Cachexia",
				"value": "R64"
			},
			"eventDetails_antecedentCause4": {
				"label": "Unspecified protein-energy malnutrition",
				"value": "E46"
			},
			"eventDetails_immediateCauseOfDeath": {
				"label": "Secondary malignant neoplasm of liver and intrahepatic bile duct",
				"value": "C787"
			},
			"eventDetails_antecedentCauseInterval2": {
				"unit": "Months",
				"numericValue": 6
			},
			"eventDetails_antecedentCauseInterval4": {
				"unit": "Months",
				"numericValue": 8
			},
			"eventDetails_immediateCauseOfDeathInterval": {
				"unit": "Months",
				"numericValue": 3
			}
		},
		"event_id": "3862b640-1e06-4a91-a4a3-f77e1b6b10e8",
		"id": "736621dd-1e55-4190-8abe-6cc88c210d45",
		"original_action_id": "4b8f0797-9f7b-4594-8ac5-69da9e918263",
		"registration_number": null,
		"request_id": null,
		"status": "Accepted",
		"transaction_id": "92fe89a6-3739-42dc-ac77-926fb60e4e7e",
		"content": null,
		"custom_action_type": null
	}
]

  */

  const client = getClient()
  try {
    await client.transaction().execute(async (trx) => {
      await importEvent(event, trx)
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
