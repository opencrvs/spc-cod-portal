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

import { AdvancedSearchConfig, event, field } from '@opencrvs/toolkit/events'

const deceasedPrefix = {
  id: 'death.search.criteria.label.prefix.deceased',
  defaultMessage: "Deceased's",
  description: 'Deceased prefix'
}

export const advancedSearchDeath = [
  {
    title: {
      defaultMessage: 'Coding details',
      description: 'The title of Coding details accordion',
      id: 'advancedSearch.form.registrationDetails'
    },
    fields: [
      event('legalStatuses.REGISTERED.createdAtLocation').within(),
      event('legalStatuses.REGISTERED.acceptedAt').range(),
      event('status').exact(),
      event('updatedAt').range()
    ]
  },
  {
    title: {
      defaultMessage: 'Deceased details',
      description: 'The title of Deceased details accordion',
      id: 'advancedSearch.form.deceasedDetails'
    },
    fields: [
      field('deceased.country', {
        searchCriteriaLabelPrefix: deceasedPrefix
      }).exact(),
      field('deceased.certificateKey', {
        searchCriteriaLabelPrefix: deceasedPrefix
      }).exact(),
      field('deceased.dob', {
        searchCriteriaLabelPrefix: deceasedPrefix
      }).range(),
      field('deceased.gender', {
        searchCriteriaLabelPrefix: deceasedPrefix
      }).exact()
    ]
  }
] satisfies AdvancedSearchConfig[]
