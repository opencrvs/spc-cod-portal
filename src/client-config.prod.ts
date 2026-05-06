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
import { defineClientConfig } from '@opencrvs/toolkit/application-config'
import { env } from './environment'
import * as fs from 'fs'
import { join } from 'path'

export default defineClientConfig({
  // Country code in uppercase ALPHA-3 format
  COUNTRY: 'FAR',
  LANGUAGES: ['en'],
  SENTRY: env.SENTRY_DSN ?? '',
  REGISTER_BACKGROUND: {
    backgroundImage: `data:image/jpg;base64,${fs
      .readFileSync(join(__dirname, 'ocean.jpg'))
      .toString('base64')}`,
    imageFit: 'FILL'
  },
  DASHBOARDS: [
    {
      id: 'export',
      title: {
        id: 'dashboard.exportTitle',
        defaultMessage: 'Download for encoding',
        description: 'Menu item for export dashboard'
      },
      url: `https://metabase.${env.DOMAIN}/public/dashboard/80c014ab-e1b6-466e-b4c0-c9ebcca2e2e2#bordered=false&titled=false&refresh=300`
    },
    {
      id: 'uploader',
      title: {
        id: 'dashboard.uploaderTitle',
        defaultMessage: 'Upload encoded',
        description: 'Menu item for uploader companion app'
      },
      url: `https://uploader.${env.DOMAIN}/login`,
      context: {
        auth: 'REQUEST_AUTH_TOKEN'
      }
    },
    {
      id: 'statistics',
      title: {
        id: 'dashboard.statisticsTitle',
        defaultMessage: 'Statistics',
        description: 'Menu item for statistics dashboard'
      },
      url: `https://metabase.${env.DOMAIN}/public/dashboard/dc66b77a-79df-4f68-8fc8-5e5d5a2d7a35#bordered=false&titled=false&refresh=300`
    }
  ],
  FEATURES: {}
})
