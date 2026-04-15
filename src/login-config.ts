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
import { defineLoginConfig } from '@opencrvs/toolkit/application-config'
import { applicationConfig } from '@countryconfig/api/application/application-config'
import * as fs from 'fs'
import { join } from 'path'

export default defineLoginConfig({
  // Country code in uppercase ALPHA-3 format
  COUNTRY: 'FAR',
  LANGUAGES: ['en'],
  LOGIN_BACKGROUND: {
    backgroundImage: `data:image/jpg;base64,${fs
      .readFileSync(join(__dirname, 'ocean.jpg'))
      .toString('base64')}`,
    imageFit: 'FILL'
  },
  SENTRY: '',
  USER_NOTIFICATION_DELIVERY_METHOD:
    applicationConfig.USER_NOTIFICATION_DELIVERY_METHOD,
  INFORMANT_NOTIFICATION_DELIVERY_METHOD:
    applicationConfig.INFORMANT_NOTIFICATION_DELIVERY_METHOD,
  PHONE_NUMBER_PATTERN: applicationConfig.PHONE_NUMBER_PATTERN
})
