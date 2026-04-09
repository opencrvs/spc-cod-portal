/* eslint-disable no-unused-vars */
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

import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi'
import { Event } from '@countryconfig/events/utils'
import { ActionType, event, never, not } from '@opencrvs/toolkit/events'

type FontFamilyTypes = {
  normal: string
  bold: string
  italics: string
  bolditalics: string
}

type JSONSchema = Record<string, any>

export interface ICertificateConfigData {
  id: string
  event: Event
  // This is a temporary field to indicate that the certificate is a v2 template.
  // As the templates are assigned to event types per id, we would not be able to define separate templates for v1 and v2 'birth' or 'death' events without this.
  // After v1 is phased out, this field can be removed.
  isV2Template?: boolean
  label: {
    id: string
    defaultMessage: string
    description: string
  }
  isDefault: boolean
  fee: {
    onTime: number
    late: number
    delayed: number
  }
  svgUrl: string
  fonts?: Record<string, FontFamilyTypes>
  conditionals?:
    | {
        type: 'SHOW'
        conditional: JSONSchema
      }[]
    | undefined
}

const notoSansFont: Record<string, FontFamilyTypes> = {
  'Noto Sans': {
    normal: '/api/countryconfig/fonts/NotoSans-Regular.ttf',
    bold: '/api/countryconfig/fonts/NotoSans-Bold.ttf',
    italics: '/api/countryconfig/fonts/NotoSans-Regular.ttf',
    bolditalics: '/api/countryconfig/fonts/NotoSans-Regular.ttf'
  }
}

const libreBaskervilleFont: Record<string, FontFamilyTypes> = {
  'Libre Baskerville': {
    normal: '/api/countryconfig/fonts/LibreBaskerville-Regular.ttf',
    bold: '/api/countryconfig/fonts/LibreBaskerville-Bold.ttf',
    italics: '/api/countryconfig/fonts/LibreBaskerville-Italic.ttf',
    bolditalics: '/api/countryconfig/fonts/LibreBaskerville-Regular.ttf'
  }
}

export async function certificateHandler(
  request: Request,
  h: ResponseToolkit
): Promise<ICertificateConfigData[] | ResponseObject> {
  if (request.params.id) {
    const filePath = `${__dirname}/source/${request.params.id}`
    return h.file(filePath)
  }
  const certificateConfigs: ICertificateConfigData[] = []
  return certificateConfigs
}
