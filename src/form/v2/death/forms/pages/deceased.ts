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
  AddressType
} from '@opencrvs/toolkit/events'

import { createSelectOptions, emptyMessage } from '@countryconfig/form/v2/utils'

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
      }
    },
    {
      id: 'deceased.dob',
      type: FieldType.DATE,
      required: true,
      analytics: true,
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
      id: 'deceased.eventDate',
      type: FieldType.DATE,
      required: true,
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
      id: 'eventDetails.placeOfDeathHelper',
      type: FieldType.PARAGRAPH,
      label: {
        defaultMessage: 'Place of death',
        description: 'This is the label for the field',
        id: 'event.death.action.declare.form.section.event.field.addressHelper.label'
      },
      configuration: { styles: { fontVariant: 'h3' } }
    },
    {
      id: 'deceased.address',
      type: FieldType.ADDRESS,
      required: true,
      secured: true,
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
