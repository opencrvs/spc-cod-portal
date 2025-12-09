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
  never,
  ConditionalType,
  defineFormPage,
  field,
  FieldType,
  not,
  or,
  PageTypes,
  TranslationConfig
} from '@opencrvs/toolkit/events'

import { createSelectOptions, emptyMessage } from '@countryconfig/form/v2/utils'

export const MannerDeathType = {
  MANNER_NATURAL: 'MANNER_NATURAL',
  MANNER_ACCIDENT: 'MANNER_ACCIDENT',
  MANNER_SUICIDE: 'MANNER_SUICIDE',
  MANNER_HOMICIDE: 'MANNER_HOMICIDE',
  MANNER_UNDETERMINED: 'MANNER_UNDETERMINED'
} as const
export type MannerDeathTypeKey = keyof typeof MannerDeathType

const mannerDeathMessageDescriptors = {
  MANNER_NATURAL: {
    defaultMessage: 'Natural causes',
    description: 'Option for form field: Manner of death',
    id: 'form.field.label.mannerOfDeathNatural'
  },
  MANNER_ACCIDENT: {
    defaultMessage: 'Accident',
    description: 'Option for form field: Manner of death',
    id: 'form.field.label.mannerOfDeathAccident'
  },
  MANNER_SUICIDE: {
    defaultMessage: 'Suicide',
    description: 'Option for form field: Manner of death',
    id: 'form.field.label.mannerOfDeathSuicide'
  },
  MANNER_HOMICIDE: {
    defaultMessage: 'Homicide',
    description: 'Option for form field: Manner of death',
    id: 'form.field.label.mannerOfDeathHomicide'
  },
  MANNER_UNDETERMINED: {
    defaultMessage: 'Manner undetermined',
    description: 'Option for form field: Manner of death',
    id: 'form.field.label.mannerOfDeathUndetermined'
  }
} satisfies Record<keyof typeof MannerDeathType, TranslationConfig>

const mannerDeathTypeOptions = createSelectOptions(
  MannerDeathType,
  mannerDeathMessageDescriptors
)

export const eventDetails = defineFormPage({
  id: 'eventDetails',
  type: PageTypes.enum.FORM,
  title: {
    defaultMessage: 'Event details',
    description: 'Form section title for event details',
    id: 'form.death.eventDetails.title'
  },
  fields: [
    {
      id: 'eventDetails.date',
      type: FieldType.DATE,
      required: true,
      secured: true,
      validation: [
        {
          message: {
            defaultMessage: 'Must be a valid date',
            description: 'This is the error message for invalid date',
            id: 'event.death.action.declare.form.section.event.field.date.error'
          },
          validator: field('eventDetails.date').isBefore().now()
        },
        {
          message: {
            defaultMessage:
              "Date of death must be after the deceased's birth date",
            description:
              'This is the error message for date of death before date of birth',
            id: 'event.death.action.declare.form.section.event.field.date.error.beforeBirth'
          },
          validator: or(
            field('eventDetails.date').isAfter().date(field('deceased.dob')),
            field('deceased.dobUnknown').isEqualTo(true)
          )
        }
      ],
      label: {
        defaultMessage: 'Date of death',
        description: 'This is the label for the field',
        id: 'event.death.action.declare.form.section.event.field.date.label'
      }
    },
    {
      id: 'eventDetails.mannerOfDeath',
      type: FieldType.NUMBER,
      conditionals: [
        {
          type: ConditionalType.ENABLE,
          conditional: never()
        }
      ],
      defaultValue: 0,
      required: false,
      label: {
        defaultMessage: 'Manner of death default for Iris ICD10',
        description: 'This is the label for the field',
        id: 'event.death.action.declare.form.section.event.field.manner.label'
      }
    },
    //
    {
      id: 'eventDetails.divider1',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    {
      id: 'eventDetails.immediateCauseOfDeath',
      type: FieldType.PARAGRAPH,
      label: {
        defaultMessage: 'Immediate cause of death',
        description: 'This is the label for the field',
        id: 'eventDetails.immediateCauseOfDeath'
      },
      configuration: { styles: { fontVariant: 'h3' } }
    },
    {
      id: 'eventDetails.otherImmediateCauseOfDeath',
      type: FieldType.TEXT,
      required: false,
      label: {
        defaultMessage: 'Other immediate cause of death',
        description: 'This is the label for the field',
        id: 'eventDetails.otherImmediateCauseOfDeath'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: not(
            field(`eventDetails.immediateCauseOfDeath`).isEqualTo('OTHER')
          )
        }
      ]
    },
    {
      id: 'eventDetails.immediateCauseOfDeathInterval',
      type: FieldType.PARAGRAPH,
      label: {
        defaultMessage: 'Interval',
        description: 'This is the label for the field',
        id: 'spcCodingGroup.immediateCauseOfDeathInterval'
      },
      configuration: { styles: { fontVariant: 'h3' } }
    },

    //
    {
      id: 'eventDetails.divider2',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    {
      id: 'eventDetails.antecedentCause1',
      type: FieldType.PARAGRAPH,
      label: {
        defaultMessage: 'Due to (Antecedent cause 1)',
        description: 'This is the label for the field',
        id: 'spcCodingGroup.antecedentCause1'
      },
      configuration: { styles: { fontVariant: 'h3' } }
    },
    {
      id: 'eventDetails.otherAntecedentCause1',
      type: FieldType.TEXT,
      required: false,
      label: {
        defaultMessage: 'Other antecedent cause 1',
        description: 'This is the label for the field',
        id: 'eventDetails.otherAntecedentCause1'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: not(
            field(`eventDetails.antecedentCause1`).isEqualTo('OTHER')
          )
        }
      ]
    },
    {
      id: 'eventDetails.otherAntecedentCause1Interval',
      type: FieldType.PARAGRAPH,
      label: {
        defaultMessage: 'Interval',
        description: 'This is the label for the field',
        id: 'spcCodingGroup.otherAntecedentCause1Interval'
      },
      configuration: { styles: { fontVariant: 'h3' } }
    },

    //
    {
      id: 'eventDetails.divider3',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    {
      id: 'eventDetails.antecedentCause2',
      type: FieldType.PARAGRAPH,
      label: {
        defaultMessage: 'Due to (Antecedent cause 2)',
        description: 'This is the label for the field',
        id: 'spcCodingGroup.antecedentCause2'
      },
      configuration: { styles: { fontVariant: 'h3' } }
    },
    {
      id: 'eventDetails.otherAntecedentCause2',
      type: FieldType.TEXT,
      required: false,
      label: {
        defaultMessage: 'Other antecedent cause 2',
        description: 'This is the label for the field',
        id: 'eventDetails.otherAntecedentCause2'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: not(
            field(`eventDetails.antecedentCause2`).isEqualTo('OTHER')
          )
        }
      ]
    },
    {
      id: 'eventDetails.otherAntecedentCause2Interval',
      type: FieldType.PARAGRAPH,
      label: {
        defaultMessage: 'Interval',
        description: 'This is the label for the field',
        id: 'spcCodingGroup.otherAntecedentCause2Interval'
      },
      configuration: { styles: { fontVariant: 'h3' } }
    },
    {
      id: 'eventDetails.divider4',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    {
      id: 'eventDetails.antecedentCause3',
      type: FieldType.PARAGRAPH,
      label: {
        defaultMessage: 'Due to (Antecedent cause 3)',
        description: 'This is the label for the field',
        id: 'spcCodingGroup.antecedentCause3'
      },
      configuration: { styles: { fontVariant: 'h3' } }
    },
    {
      id: 'eventDetails.otherAntecedentCause3',
      type: FieldType.TEXT,
      required: false,
      label: {
        defaultMessage: 'Other antecedent cause 3',
        description: 'This is the label for the field',
        id: 'eventDetails.otherAntecedentCause3'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: not(
            field(`eventDetails.antecedentCause3`).isEqualTo('OTHER')
          )
        }
      ]
    },
    {
      id: 'eventDetails.otherAntecedentCause3Interval',
      type: FieldType.PARAGRAPH,
      label: {
        defaultMessage: 'Interval',
        description: 'This is the label for the field',
        id: 'spcCodingGroup.otherAntecedentCause3Interval'
      },
      configuration: { styles: { fontVariant: 'h3' } }
    },
    {
      id: 'eventDetails.divider5',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    {
      id: 'eventDetails.antecedentCause4',
      type: FieldType.PARAGRAPH,
      label: {
        defaultMessage: 'Due to (Antecedent cause 4)',
        description: 'This is the label for the field',
        id: 'spcCodingGroup.antecedentCause4'
      },
      configuration: { styles: { fontVariant: 'h3' } }
    },
    {
      id: 'eventDetails.otherAntecedentCause4',
      type: FieldType.TEXT,
      required: false,
      label: {
        defaultMessage: 'Other antecedent cause 4',
        description: 'This is the label for the field',
        id: 'eventDetails.otherAntecedentCause4'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: not(
            field(`eventDetails.antecedentCause4`).isEqualTo('OTHER')
          )
        }
      ]
    },
    {
      id: 'eventDetails.otherAntecedentCause4Interval',
      type: FieldType.PARAGRAPH,
      label: {
        defaultMessage: 'Interval',
        description: 'This is the label for the field',
        id: 'spcCodingGroup.otherAntecedentCause4Interval'
      },
      configuration: { styles: { fontVariant: 'h3' } }
    },

    //
    {
      id: 'eventDetails.comments',
      type: FieldType.TEXTAREA,
      required: false,
      label: {
        defaultMessage: 'Comments',
        description:
          'Description of cause of death by lay person or verbal autopsy',
        id: 'spcCodingGroup.comments'
      }
    }
  ]
})
