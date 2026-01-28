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
  ConditionalType,
  defineFormPage,
  field,
  FieldType,
  PageTypes,
  TranslationConfig
} from '@opencrvs/toolkit/events'
import { createSelectOptions } from '@countryconfig/form/v2/utils'

import { emptyMessage } from '@countryconfig/form/v2/utils'

export const SymptomType = {
  SYMPTOM_1: 'SYMPTOM_1',
  OTHER: 'OTHER'
} as const

const spcSymptomMessageDescriptors = {
  SYMPTOM_1: {
    defaultMessage: 'An example CoD symptom',
    description: '',
    id: 'spcRegionalGroup.SYMPTOM_1'
  },
  OTHER: {
    defaultMessage: 'Other',
    description: '',
    id: 'form.field.label.otherOption'
  }
} satisfies Record<keyof typeof SymptomType, TranslationConfig>

const spcSymptomOptions = createSelectOptions(
  SymptomType,
  spcSymptomMessageDescriptors
)

export const eventDetails = defineFormPage({
  id: 'eventDetails',
  type: PageTypes.enum.FORM,
  title: {
    defaultMessage: 'Cause of death details',
    description: 'Form section title for event details',
    id: 'form.death.eventDetails.title'
  },
  fields: [
    {
      id: 'eventDetails.immediateCauseOfDeath',
      type: FieldType.SELECT,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Cause of death A',
        description: 'This is the label for the field',
        id: 'eventDetails.immediateCauseOfDeath'
      },
      options: spcSymptomOptions
    },
    {
      id: 'eventDetails.otherImmediateCauseOfDeath',
      type: FieldType.TEXT,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Other cause of death A',
        description: 'This is the label for the field',
        id: 'eventDetails.otherImmediateCauseOfDeath'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: field(`eventDetails.immediateCauseOfDeath`).isEqualTo(
            'OTHER'
          )
        }
      ]
    },
    {
      id: 'eventDetails.immediateCauseOfDeathInterval',
      type: FieldType.NUMBER,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Duration',
        description: 'This is the label for the field',
        id: 'spcCodingGroup.immediateCauseOfDeathInterval'
      }
    },

    //
    {
      id: 'eventDetails.divider2',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    {
      id: 'eventDetails.antecedentCause1',
      type: FieldType.SELECT,
      label: {
        defaultMessage: 'Cause of death B',
        description: 'This is the label for the field',
        id: 'eventDetails.antecedentCause1'
      },
      options: spcSymptomOptions
    },
    {
      id: 'eventDetails.otherAntecedentCause1',
      type: FieldType.TEXT,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Other antecedent cause 1',
        description: 'This is the label for the field',
        id: 'eventDetails.otherAntecedentCause1'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: field(`eventDetails.antecedentCause1`).isEqualTo('OTHER')
        }
      ]
    },
    {
      id: 'eventDetails.antecedentCauseInterval1',
      type: FieldType.NUMBER,
      label: {
        defaultMessage: 'Duration',
        description: 'This is the label for the field',
        id: 'spcCodingGroup.antecedentCauseInterval1'
      },
      required: false,
      analytics: true
    },

    //
    {
      id: 'eventDetails.divider3',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    {
      id: 'eventDetails.antecedentCause2',
      type: FieldType.SELECT,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Cause of death C',
        description: 'This is the label for the field',
        id: 'eventDetails.antecedentCause2'
      },
      options: spcSymptomOptions
    },
    {
      id: 'eventDetails.otherAntecedentCause2',
      type: FieldType.TEXT,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Other antecedent cause 2',
        description: 'This is the label for the field',
        id: 'eventDetails.otherAntecedentCause2'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: field(`eventDetails.antecedentCause2`).isEqualTo('OTHER')
        }
      ]
    },
    {
      id: 'eventDetails.antecedentCauseInterval2',
      type: FieldType.NUMBER,
      label: {
        defaultMessage: 'Duration',
        description: 'This is the label for the field',
        id: 'spcCodingGroup.antecedentCauseInterval2'
      },
      required: false,
      analytics: true
    },
    {
      id: 'eventDetails.divider4',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    {
      id: 'eventDetails.antecedentCause3',
      type: FieldType.SELECT,
      label: {
        defaultMessage: 'Cause of death D',
        description: 'This is the label for the field',
        id: 'eventDetails.antecedentCause3'
      },
      options: spcSymptomOptions
    },
    {
      id: 'eventDetails.otherAntecedentCause3',
      type: FieldType.TEXT,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Other antecedent cause 3',
        description: 'This is the label for the field',
        id: 'eventDetails.otherAntecedentCause3'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: field(`eventDetails.antecedentCause3`).isEqualTo('OTHER')
        }
      ]
    },
    {
      id: 'eventDetails.antecedentCauseInterval3',
      type: FieldType.NUMBER,
      label: {
        defaultMessage: 'Duration',
        description: 'This is the label for the field',
        id: 'spcCodingGroup.antecedentCauseInterval3'
      },
      required: false,
      analytics: true
    },
    {
      id: 'eventDetails.divider5',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    {
      id: 'eventDetails.antecedentCause4',
      type: FieldType.SELECT,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Cause of death E',
        description: 'This is the label for the field',
        id: 'eventDetails.antecedentCause4'
      },
      options: spcSymptomOptions
    },
    {
      id: 'eventDetails.otherAntecedentCause4',
      type: FieldType.TEXT,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Other antecedent cause 4',
        description: 'This is the label for the field',
        id: 'eventDetails.otherAntecedentCause4'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: field(`eventDetails.antecedentCause4`).isEqualTo('OTHER')
        }
      ]
    },
    {
      id: 'eventDetails.antecedentCauseInterval4',
      type: FieldType.NUMBER,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Duration',
        description: 'This is the label for the field',
        id: 'spcCodingGroup.antecedentCauseInterval4'
      }
    },
    {
      id: 'eventDetails.divider6',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    {
      id: 'eventDetails.otherSignificantCondition',
      type: FieldType.TEXT,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Other significant conditions contributing to death',
        description: 'This is the label for the field',
        id: 'eventDetails.otherSignificantCondition'
      }
    },
    {
      id: 'eventDetails.significantConditionInterval',
      type: FieldType.NUMBER,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Duration',
        description: 'This is the label for the field',
        id: 'spcCodingGroup.significantConditionInterval'
      }
    },
    {
      id: 'eventDetails.divider7',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    {
      id: 'eventDetails.comments',
      type: FieldType.TEXTAREA,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Comments',
        description:
          'Description of cause of death by lay person or verbal autopsy',
        id: 'spcCodingGroup.comments'
      }
    },
    {
      id: 'eventDetails.deathLocationId',
      type: FieldType.ALPHA_HIDDEN,
      required: false,
      label: {
        defaultMessage: 'Health Institution',
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.child.field.birthLocation.label'
      },
      parent: [
        field('eventDetails.placeOfDeath'),
        field('eventDetails.deathLocation'),
        field('eventDetails.deathLocationOther'),
        field('deceased.address')
      ],
      value: [
        field('eventDetails.deathLocation'),
        field('eventDetails.deathLocationOther').get('administrativeArea'),
        field('deceased.address').get('administrativeArea')
      ]
    }
  ]
})
