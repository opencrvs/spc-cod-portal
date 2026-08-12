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
import { ActionConfirmationRequest } from '../registration'
import { eventConfigs } from '@countryconfig/events'
import { createClient } from '@opencrvs/toolkit/api'
import { GATEWAY_URL } from '@countryconfig/constants'

export function getEventsHandler(_: Hapi.Request, h: Hapi.ResponseToolkit) {
  return h.response(eventConfigs).code(200)
}

export async function onCustomActionHandler(
  _: ActionConfirmationRequest,
  h: Hapi.ResponseToolkit
) {
  return h.response().code(200)
}

interface UserInfo {
  id: string
  email: string
  firstName: string
  lastName: string
}

export async function getUserById(
  token: string,
  userId: string
): Promise<UserInfo | null> {
  const url = new URL('events', GATEWAY_URL).toString()
  const client = createClient(url, `Bearer ${token}`)

  try {
    const userOrSystem = await client.user.get.query(userId)

    if (userOrSystem.type === 'user') {
      return {
        id: userOrSystem.id || userId,
        email: userOrSystem.email || '',
        firstName: userOrSystem.name.firstname,
        lastName: userOrSystem.name.surname
      }
    }
    return null
  } catch (error) {
    return null
  }
}

/**
 * This catch-all action route will receive event actions with `Content-Type: application/json`
 */
export async function onAnyActionHandler(
  request: ActionConfirmationRequest,
  h: Hapi.ResponseToolkit
) {
  /*const token = request.auth.artifacts.token as string
  const event = request.payload*/

  // Disabling usual notifications await sendInformantNotification({ event, token })

  return h.response().code(200)
}
