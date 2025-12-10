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
import { ActionType, defineConfig, field } from '@opencrvs/toolkit/events'
import {
  DEATH_DECLARATION_REVIEW,
  DEATH_DECLARATION_FORM
} from './forms/declaration'
import { Event } from '@countryconfig/form/types/types'
import { DEATH_CERTIFICATE_COLLECTOR_FORM } from '../death/forms/printForm'
import { advancedSearchDeath } from './advancedSearch'
import { DEATH_CORRECTION_FORM } from './forms/correctionForm'
import { dedupConfig } from './dedupConfig'

export const deathEvent = defineConfig({
  id: Event.Death,
  declaration: DEATH_DECLARATION_FORM,
  label: {
    defaultMessage: 'Medical Certificate of Cause of Death',
    description: 'This is what this event is referred as in the system',
    id: 'event.death.label'
  },
  dateOfEvent: field('deceased.eventDate'),
  title: {
    defaultMessage: '{deceased.country}: {deceased.certificateKey}',
    description: 'This is the title of the summary',
    id: 'event.death.title'
  },
  fallbackTitle: {
    id: 'event.tennis-club-membership.fallbackTitle',
    defaultMessage: 'No details provided',
    description:
      'This is a fallback title if actual title resolves to empty string'
  },
  summary: {
    fields: [
      {
        fieldId: 'deceased.eventDate',
        emptyValueMessage: {
          defaultMessage: 'No date of death',
          description:
            'This is shown when there is no date of death information',
          id: 'event.death.summary.deceased.eventDate.empty'
        }
      },
      {
        fieldId: 'deceased.gender',
        emptyValueMessage: {
          defaultMessage: 'No gender specified',
          description: 'This is shown when there is no gender information',
          id: 'event.death.summary.eventDetails.gender.empty'
        },
        label: {
          defaultMessage: 'Sex',
          description: 'This is the label for the field',
          id: 'event.death.action.declare.form.section.deceased.field.gender.label'
        }
      },
      {
        fieldId: 'deceased.dob',
        emptyValueMessage: {
          defaultMessage: 'No dob specified',
          description: 'This is shown when there is no dob information',
          id: 'event.death.summary.eventDetails.dob.empty'
        },
        label: {
          defaultMessage: 'Date of birth',
          description: 'This is the label for the field',
          id: 'event.death.action.declare.form.section.deceased.field.dob.label'
        }
      }
    ]
  },
  actions: [
    {
      type: ActionType.READ,
      label: {
        defaultMessage: 'Read',
        description:
          'This is shown as the action name anywhere the user can trigger the action from',
        id: 'event.death.action.Read.label'
      },
      review: DEATH_DECLARATION_REVIEW
    },
    {
      type: ActionType.DECLARE,
      label: {
        defaultMessage: 'Declare',
        description:
          'This is shown as the action name anywhere the user can trigger the action from',
        id: 'event.death.action.declare.label'
      },
      review: DEATH_DECLARATION_REVIEW,
      deduplication: {
        id: 'death-deduplication',
        label: {
          defaultMessage: 'Detect duplicate',
          description:
            'This is shown as the action name anywhere the user can trigger the action from',
          id: 'event.death.action.detect-duplicate.label'
        },
        query: dedupConfig
      }
    },
    {
      type: ActionType.VALIDATE,
      label: {
        defaultMessage: 'Validate',
        description:
          'This is shown as the action name anywhere the user can trigger the action from',
        id: 'event.death.action.validate.label'
      },
      review: DEATH_DECLARATION_REVIEW,
      deduplication: {
        id: 'death-deduplication',
        label: {
          defaultMessage: 'Detect duplicate',
          description:
            'This is shown as the action name anywhere the user can trigger the action from',
          id: 'event.death.action.detect-duplicate.label'
        },
        query: dedupConfig
      }
    },
    {
      type: ActionType.REGISTER,
      label: {
        defaultMessage: 'Register',
        description:
          'This is shown as the action name anywhere the user can trigger the action from',
        id: 'event.death.action.register.label'
      },
      review: DEATH_DECLARATION_REVIEW,
      deduplication: {
        id: 'death-deduplication',
        label: {
          defaultMessage: 'Detect duplicate',
          description:
            'This is shown as the action name anywhere the user can trigger the action from',
          id: 'event.death.action.detect-duplicate.label'
        },
        query: dedupConfig
      }
    },
    {
      type: ActionType.PRINT_CERTIFICATE,
      label: {
        defaultMessage: 'Print certificate',
        description:
          'This is shown as the action name anywhere the user can trigger the action from',
        id: 'event.death.action.collect-certificate.label'
      },
      printForm: DEATH_CERTIFICATE_COLLECTOR_FORM
    },
    {
      type: ActionType.REQUEST_CORRECTION,
      label: {
        defaultMessage: 'Correct record',
        description:
          'This is shown as the action name anywhere the user can trigger the action from',
        id: 'event.death.action.request-correction.label'
      },
      correctionForm: DEATH_CORRECTION_FORM
    }
  ],
  advancedSearch: advancedSearchDeath
})
