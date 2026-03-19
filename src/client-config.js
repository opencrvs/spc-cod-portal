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
/**
 * When running application in slow network condition (reproducible using 3G), the client-config.js might be loaded twice.
 * This results to issues like `Uncaught SyntaxError: "identifier scheme has already been declared at (client-config.js:1:1")`.
 *
 * On high level, refreshing the browser window requests new document page. The document page includes script tag to load client-config.js.
 * If the network is slow, the browser might start loading and executing client-config.js again before the previous one is torn down, causing the error.
 *
 */
;(function initClientConfig() {
  // eslint-disable-next-line no-undef
  window.config = {
    API_GATEWAY_URL: 'http://localhost:7070/',
    CONFIG_API_URL: 'http://localhost:2021',
    LOGIN_URL: 'http://localhost:3020',
    AUTH_URL: 'http://localhost:7070/auth/',
    MINIO_BUCKET: 'ocrvs',
    MINIO_URL: 'http://localhost:3535/ocrvs/',
    MINIO_BASE_URL: 'http://localhost:3535', // URL without path/bucket information, used for file uploads, v2
    COUNTRY_CONFIG_URL: 'http://localhost:3040',
    // Country code in uppercase ALPHA-3 format
    COUNTRY: 'FAR',
    LANGUAGES: 'en',
    SENTRY: '',
    DASHBOARDS: [
      {
        id: 'export',
        title: {
          id: 'dashboard.exportTitle',
          defaultMessage: 'Download for encoding',
          description: 'Menu item for export dashboard'
        },
        url: `http://localhost:4444/public/dashboard/80c014ab-e1b6-466e-b4c0-c9ebcca2e2e2#bordered=false&titled=false&refresh=300`
      },
      {
        id: 'uploader',
        title: {
          id: 'dashboard.uploaderTitle',
          defaultMessage: 'Upload encoded',
          description: 'Menu item for uploader companion app'
        },
        url: `http://localhost:3069/login`,
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
        url: `http://localhost:4444/public/dashboard/dc66b77a-79df-4f68-8fc8-5e5d5a2d7a35#bordered=false&titled=false&refresh=300`
      }
    ],
    FEATURES: {}
  }
})()
