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

import {
  defineFormPage,
  FieldType,
  event,
  ActionType
} from '@opencrvs/toolkit/events'

export const irisOutput = defineFormPage({
  id: 'irisOutput',
  title: {
    defaultMessage: 'Iris Output',
    description: 'Form section title for iris output',
    id: 'spcCodingGroup.irisOutput.title'
  },
  // conditional: event.hasAction(ActionType.REGISTER), I assume this will hide the page unless the event is being registered
  fields: [
    {
      id: 'irisOutput.data',
      type: FieldType.DATA,
      label: {
        defaultMessage: 'Iris Output',
        description: 'Form section title for iris output',
        id: 'spcCodingGroup.irisOutput.title'
      },
      configuration: {
        data: [
          {
            id: 'ucCode',
            label: {
              defaultMessage: 'UC Code',
              description: 'Form section title for uc code',
              id: 'spcCodingGroup.ucCode.title'
            },
            value: 'Default'
          },
          {
            id: 'selectedCodes',
            label: {
              defaultMessage: 'Selected Codes',
              description: 'Form section title for selectedCodes',
              id: 'spcCodingGroup.selectedCodes.title'
            },
            value: 'Default'
          },
          {
            id: 'multipleCodes',
            label: {
              defaultMessage: 'Multiple Codes',
              description: 'Form section title for multipleCodes',
              id: 'spcCodingGroup.multipleCodes.title'
            },
            value: 'Default'
          }
        ]
      }
    },
    {
      id: 'irisOutput.comment',
      type: FieldType.TEXTAREA,
      label: {
        defaultMessage: 'Comment',
        id: 'event.death.action.declare.form.review.comment.label',
        description: 'Label for the comment field in the review section'
      },
      defaultValue: 'Default',
      required: false
    }
  ]
})
