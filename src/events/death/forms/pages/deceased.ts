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
  TranslationConfig,
  FieldType,
  PageTypes,
  field,
  or,
  user,
  AddressType,
  never,
  not,
  ConditionalType
} from '@opencrvs/toolkit/events'

import { createSelectOptions, emptyMessage } from '@countryconfig/events/utils'
import { COUNTRY_CONFIG_URL } from '@countryconfig/constants'

const GenderTypes = {
  MALE: '1',
  FEMALE: '2',
  OTHER: '8',
  UNKNOWN: '9'
} as const

const genderMessageDescriptors = {
  MALE: {
    defaultMessage: 'Male',
    description: 'Label for option male',
    id: 'form.field.label.sexMale'
  },
  FEMALE: {
    defaultMessage: 'Female',
    description: 'Label for option female',
    id: 'form.field.label.sexFemale'
  },
  OTHER: {
    defaultMessage: 'Other',
    description: '',
    id: 'form.field.label.otherOption'
  },
  UNKNOWN: {
    defaultMessage: 'Unknown',
    description: 'Label for option unknown',
    id: 'form.field.label.sexUnknown'
  }
} satisfies Record<keyof typeof GenderTypes, TranslationConfig>

const genderOptions = createSelectOptions(GenderTypes, genderMessageDescriptors)

export const deceased = defineFormPage({
  id: 'deceased',
  type: PageTypes.enum.FORM,
  title: {
    defaultMessage: "Deceased's details",
    description: 'Form section title for Deceased',
    id: 'form.death.deceased.title'
  },
  fields: [
    {
      id: 'deceased.certificateKey',
      type: FieldType.TEXT,
      required: true,
      analytics: true,
      label: {
        defaultMessage: 'Certificate Key',
        description: 'This is the label for the field',
        id: 'spcRegionalGroup.certificateKey'
      },
      validation: [
        {
          message: {
            id: 'event.death.action.declare.field.certificateKey.error',
            defaultMessage: 'Certificate key exists already',
            description: 'This is the error message for invalid certificate key'
          },
          validator: not(
            field('deceased.fetch-http-certificateKey')
              .get('data.exists')
              .isEqualTo(true)
          )
        }
      ]
    },
    {
      id: 'deceased.fetch-http-certificateKey',
      type: FieldType.HTTP,
      required: true,
      conditionals: [
        {
          type: ConditionalType.DISPLAY_ON_REVIEW,
          conditional: never()
        }
      ],
      label: {
        defaultMessage: 'Certificate Key',
        description: 'This is the label for the field',
        id: 'spcRegionalGroup.certificateKey'
      },
      configuration: {
        trigger: field(`deceased.certificateKey`),
        url: `${COUNTRY_CONFIG_URL}/check-deceased-keys`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          id: field('deceased.certificateKey')
        },
        timeout: 5000
      }
    },
    {
      id: `deceased.fetch-loader`,
      type: FieldType.LOADER,
      parent: field(`deceased.fetch-http-certificateKey`),
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: not(
            field(`deceased.fetch-http-certificateKey`).get('loading').isFalsy()
          )
        },
        {
          type: ConditionalType.DISPLAY_ON_REVIEW,
          conditional: never()
        }
      ],
      label: {
        id: 'form.fetch-loader.label',
        defaultMessage: 'Checking if deceased certificate key exists',
        description:
          'This is the label for the loader to check if the deceased certificate key exists in the system'
      },
      configuration: {
        text: {
          id: 'form.fetch-loader.label',
          defaultMessage: 'Checking if deceased certificate key exists',
          description:
            'This is the label for the loader to check if the deceased certificate key exists in the system'
        }
      }
    },
    {
      id: 'deceased.dob',
      type: FieldType.DATE,
      required: true,
      analytics: true,
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: not(field('deceased.dobUnknown').isEqualTo(true))
        }
      ],
      validation: [
        {
          message: {
            defaultMessage: 'Must be a valid Birthdate',
            description: 'This is the error message for invalid date',
            id: 'event.death.action.declare.form.section.deceased.field.dob.error'
          },
          validator: field('deceased.dob').isBefore().now()
        },
        {
          message: {
            defaultMessage: 'Date of birth must be before the date of death',
            description:
              'This is the error message for date of birth later than date of death',
            id: 'event.death.action.declare.form.section.deceased.field.dob.error.laterThanDeath'
          },
          validator: field('deceased.dob')
            .isBefore()
            .date(field('deceased.eventDate'))
        }
      ],
      label: {
        defaultMessage: 'Date of birth',
        description: 'This is the label for the field',
        id: 'event.death.action.declare.form.section.deceased.field.dob.label'
      }
    },
    {
      id: 'deceased.dobUnknown',
      type: FieldType.CHECKBOX,
      label: {
        defaultMessage: 'Exact date of birth unknown',
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.person.field.age.checkbox.label'
      },
      conditionals: [
        {
          type: ConditionalType.DISPLAY_ON_REVIEW,
          conditional: never()
        }
      ]
    },
    {
      id: 'deceased.age',
      type: FieldType.AGE,
      required: true,
      analytics: true,
      label: {
        defaultMessage: `Age of deceased (at the time of event)`,
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.deceased.field.age.label'
      },
      configuration: {
        asOfDate: field('deceased.eventDate'),
        postfix: {
          defaultMessage: 'years',
          description: 'This is the postfix for age field',
          id: 'event.birth.action.declare.form.section.person.field.age.postfix'
        }
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: field('deceased.dobUnknown').isEqualTo(true)
        }
      ]
    },
    {
      id: 'deceased.eventDate',
      type: FieldType.DATE,
      required: false,
      analytics: true,
      validation: [
        {
          message: {
            defaultMessage: 'Must be a valid date',
            description: 'This is the error message for invalid date',
            id: 'event.death.action.declare.form.section.event.field.date.error'
          },
          validator: field('deceased.eventDate').isBefore().now()
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
            field('deceased.eventDate').isAfter().date(field('deceased.dob'))
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
      id: 'deceased.gender',
      type: FieldType.SELECT,
      required: true,
      analytics: true,
      label: {
        defaultMessage: 'Sex',
        description: 'This is the label for the field',
        id: 'event.death.action.declare.form.section.deceased.field.gender.label'
      },
      options: genderOptions
    },

    {
      id: 'deceased.divider1',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },

    {
      id: `deceased.addressHelper`,
      type: FieldType.HEADING,
      label: {
        defaultMessage: 'Place of death',
        description: 'This is the label for the field',
        id: 'event.death.action.declare.form.section.event.field.addressHelper.label'
      },
      configuration: {
        styles: { fontVariant: 'h3' }
      },
      conditionals: [
        {
          type: ConditionalType.DISPLAY_ON_REVIEW,
          conditional: never()
        }
      ]
    },
    {
      id: 'deceased.address',
      type: FieldType.ADDRESS,
      required: true,
      analytics: true,
      hideLabel: true,
      label: {
        defaultMessage: 'Place of death',
        description: 'This is the label for the field',
        id: 'event.death.action.declare.form.section.person.field.address.label'
      },
      conditionals: [],
      validation: [],
      defaultValue: {
        country: 'FAR',
        addressType: AddressType.DOMESTIC,
        administrativeArea: user('primaryOfficeId').locationLevel('province')
      },
      configuration: {
        streetAddressForm: []
      }
    }
  ]
})
