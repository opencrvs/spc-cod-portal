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
import { deathEvent } from '@countryconfig/events/death'
import * as Hapi from '@hapi/hapi'
import { ActionConfirmationRequest } from '../registration'
import { createClient } from '@opencrvs/toolkit/api'
import { GATEWAY_URL } from '@countryconfig/constants'
import {
  IdentUploaderNotificationPayload,
  RecordsToEmail
} from '../ident-uploader-notification/handler'
import { sendCoDEmail } from '../ident-uploader-notification/service'
import {
  aggregateActionDeclarations,
  deepMerge,
  getPendingAction
} from '@opencrvs/toolkit/events'

export function getEventsHandler(_: Hapi.Request, h: Hapi.ResponseToolkit) {
  return h.response([deathEvent]).code(200)
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

    console.log('userOrSystem :>> ', userOrSystem)

    if (userOrSystem.type === 'user') {
      return {
        id: userOrSystem.id || userId,
        email: userOrSystem.email || '',
        firstName: userOrSystem.name?.[0]?.given?.[0] || '',
        lastName: userOrSystem.name?.[0]?.family || ''
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
  const token = request.auth.artifacts.token as string
  const event = request.payload

  // Disabling usual notifications await sendInformantNotification({ event, token })

  return h.response().code(200)
}
export async function onCorrectionHandler(
  request: ActionConfirmationRequest,
  h: Hapi.ResponseToolkit
) {
  const token = request.auth.artifacts.token as string
  const event = request.payload
  const createAction = event.actions.find((action) => action.type === 'CREATE')
  const pendingAction = getPendingAction(event.actions)
  const declaration = deepMerge(
    aggregateActionDeclarations(event),
    pendingAction.declaration
  )
  const userInfo = await getUserById(token, createAction?.createdBy as string)
  if (!userInfo) {
    throw new Error('User not found for correction notification')
  }
  const records = [
    {
      status: 'corrected',
      trackingId: event.trackingId,
      certKey: declaration.deceased_certificateKey
    }
  ] as RecordsToEmail[]

  const payload: IdentUploaderNotificationPayload = {
    recipient: {
      name: {
        firstname: userInfo.firstName,
        surname: userInfo.lastName
      },
      email: userInfo.email
    },
    records
  }

  return await sendCoDEmail(payload, h)
}
