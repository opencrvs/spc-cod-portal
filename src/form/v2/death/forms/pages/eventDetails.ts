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
  never,
  not,
  PageTypes,
  TranslationConfig
} from '@opencrvs/toolkit/events'
import { createSelectOptions } from '@countryconfig/form/v2/utils'
import { COUNTRY_CONFIG_URL } from '@countryconfig/constants'
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
const durationOptions = [
  {
    value: 'Minutes',
    label: {
      id: 'unit.minutes',
      defaultMessage: 'Minutes',
      description: 'Minutes'
    }
  },
  {
    value: 'Hours',
    label: {
      id: 'unit.hours',
      defaultMessage: 'Hours',
      description: 'Hours'
    }
  },
  {
    value: 'Days',
    label: {
      id: 'unit.days',
      defaultMessage: 'Days',
      description: 'Days'
    }
  },
  {
    value: 'Weeks',
    label: {
      id: 'unit.weeks',
      defaultMessage: 'Weeks',
      description: 'Weeks'
    }
  },
  {
    value: 'Months',
    label: {
      id: 'unit.months',
      defaultMessage: 'Months',
      description: 'Months'
    }
  },
  {
    value: 'Years',
    label: {
      id: 'unit.years',
      defaultMessage: 'Years',
      description: 'Years'
    }
  }
]

type CauseLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'Other'

const symptomNames = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight'
] as const

const symptomNumberLabel = [
  'Symptom 1',
  'Symptom 2',
  'Symptom 3',
  'Symptom 4',
  'Symptom 5',
  'Symptom 6',
  'Symptom 7',
  'Symptom 8'
]

function createSymptomFields(letter: CauseLetter) {
  return symptomNames.flatMap((name, index) => {
    const basePath = `eventDetails.causeOfDeath${letter}.symptom.${name}`

    const autocompleteField: any = {
      id: basePath,
      type: FieldType.AUTOCOMPLETE,
      analytics: true,
      label: {
        defaultMessage: symptomNumberLabel[index],
        description: 'This is the label for the field',
        id: `${basePath}.label`
      },
      configuration: {
        url: `${COUNTRY_CONFIG_URL}/causes-of-death?terms=`
      }
    }

    if (index > 0) {
      autocompleteField.conditionals = [
        {
          type: ConditionalType.SHOW,
          conditional: field(
            `eventDetails.causeOfDeath${letter}.add.symptom.button`
          ).isGreaterThan(index - 1)
        }
      ]
    }

    const otherField = {
      id: `${basePath}.other`,
      type: FieldType.TEXTAREA,
      required: false,
      analytics: true,
      label: {
        defaultMessage:
          'Enter the diagnosis or condition not found in the list above',
        description: 'This is the label for the field',
        id: `${basePath}.other.label`
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: field(basePath).get('value').isEqualTo('OTHER')
        }
      ]
    }

    return [autocompleteField, otherField]
  })
}

export function createCauseOfDeathFields(letter: CauseLetter) {
  const base = `eventDetails.causeOfDeath${letter}`

  return [
    {
      id: base,
      type: FieldType.PARAGRAPH,
      label: {
        defaultMessage:
          letter === 'Other'
            ? 'Other significant conditions'
            : `Cause of death ${letter}`,
        description: 'This is the label for the field',
        id: `${base}.label`
      },
      configuration: { styles: { fontVariant: 'h3' as const } }
    },
    {
      id: `${base}.symptom.one`,
      type: FieldType.AUTOCOMPLETE,
      analytics: true,
      helperText: {
        defaultMessage:
          'Select the condition that most directly led to death, or choose "Other" to enter a diagnosis not listed',
        description: 'This is the label for the field',
        id: `${base}.symptom.one.helperText`
      },
      label: {
        defaultMessage: 'Symptom 1',
        description: 'This is the label for the field',
        id: `${base}.symptom.one.label`
      },
      configuration: {
        url: `${COUNTRY_CONFIG_URL}/causes-of-death?terms=`
      }
    },
    {
      id: `${base}.symptom.one.other`,
      type: FieldType.TEXTAREA,
      required: false,
      analytics: true,
      label: {
        defaultMessage:
          'Enter the diagnosis or condition not found in the list above',
        description: 'This is the label for the field',
        id: `${base}.symptom.one.other.label`
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: field(`${base}.symptom.one`)
            .get('value')
            .isEqualTo('OTHER')
        }
      ]
    },
    ...createSymptomFields(letter).slice(2),
    {
      id: `${base}.add.symptom.button`,
      type: FieldType.BUTTON,
      hideLabel: true,
      label: {
        defaultMessage: 'Add another symptom',
        description: 'This is the label for the field',
        id: `${base}.add.symptom.buttonText`
      },
      configuration: {
        text: {
          defaultMessage: 'Add another symptom',
          description: 'This is the label for the field',
          id: `${base}.add.symptom.buttonText`
        },
        icon: 'Plus'
      },
      conditionals: [
        {
          type: ConditionalType.ENABLE,
          conditional: not(field(`${base}.add.symptom.button`).isEqualTo(7))
        },
        {
          type: ConditionalType.DISPLAY_ON_REVIEW,
          conditional: never()
        }
      ]
    },
    {
      id: `${base}.interval`,
      type: FieldType.NUMBER_WITH_UNIT,
      required: false,
      analytics: true,
      helperText: {
        defaultMessage: 'Interval between onset and death',
        description: 'This is the label for the field',
        id: `spcCodingGroup.causeOfDeath${letter}.interval.helperText`
      },
      label: {
        defaultMessage: 'Duration',
        description: 'This is the label for the field',
        id: `spcCodingGroup.causeOfDeath${letter}.interval`
      },
      options: durationOptions
    }
  ]
}

const causeOfDeathA = createCauseOfDeathFields('A')
const causeOfDeathB = createCauseOfDeathFields('B')
const causeOfDeathC = createCauseOfDeathFields('C')
const causeOfDeathD = createCauseOfDeathFields('D')
const causeOfDeathE = createCauseOfDeathFields('E')
const otherSignificantSymptoms = createCauseOfDeathFields('Other')

export const eventDetails = defineFormPage({
  id: 'eventDetails',
  type: PageTypes.enum.FORM,
  title: {
    defaultMessage: 'Cause of death details',
    description: 'Form section title for event details',
    id: 'form.death.eventDetails.title'
  },
  fields: [
    ...causeOfDeathA,
    {
      id: 'eventDetails.divider1',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    ...causeOfDeathB,
    {
      id: 'eventDetails.divider2',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    ...causeOfDeathC,
    {
      id: 'eventDetails.divider3',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    ...causeOfDeathD,
    {
      id: 'eventDetails.divider4',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    ...causeOfDeathE,
    {
      id: 'eventDetails.divider5',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    // Other significant conditions
    ...otherSignificantSymptoms
  ]
})
