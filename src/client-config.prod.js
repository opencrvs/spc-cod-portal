/* eslint-disable no-undef */
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
; (function initClientConfig() {
  const scheme = window.location.protocol // "http:" or "https:"
  const hostname = '{{hostname}}' // Replaced dynamically
  const sentry = '{{sentry}}' // Replaced dynamically

  window.config = {
    MINIO_URL: `${scheme}//minio.${hostname}/ocrvs/`,
    MINIO_BASE_URL: `${scheme}//minio.${hostname}`, // URL without path/bucket information, used for file uploads, v2
    MINIO_BUCKET: 'ocrvs',
    // Country code in uppercase ALPHA-3 format
    COUNTRY: 'FAR',
    LANGUAGES: ['en', 'fr'],
    SENTRY: sentry,
    REGISTER_BACKGROUND: { backgroundColor: '36304E' },
    DASHBOARDS: [
      {
        id: 'export',
        title: {
          id: 'dashboard.exportTitle',
          defaultMessage: 'Download for encoding',
          description: 'Menu item for export dashboard'
        },
        url: `${scheme}//metabase.${hostname}/public/dashboard/80c014ab-e1b6-466e-b4c0-c9ebcca2e2e2#bordered=false&titled=false&refresh=300`
      },
      {
        id: 'uploader',
        title: {
          id: 'dashboard.uploaderTitle',
          defaultMessage: 'Uploader',
          description: 'Menu item for uploader companion app'
        },
        url: `${scheme}//uploader.${hostname}/login`,
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
        url: `${scheme}//metabase.${hostname}/public/dashboard/dc66b77a-79df-4f68-8fc8-5e5d5a2d7a35#bordered=false&titled=false&refresh=300`
      }
    ],
    // NOTE: This is not valid javascript until replaced during build time.
    // IIFE just reveals it.
    FEATURES: {}
  }
})()
