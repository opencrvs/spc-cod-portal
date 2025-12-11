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
  ConditionalType,
  FieldType,
  PageTypes,
  field,
  or
} from '@opencrvs/toolkit/events'

import { createSelectOptions, emptyMessage } from '@countryconfig/form/v2/utils'

const GenderTypes = {
  MALE: 'male',
  FEMALE: 'female',
  UNKNOWN: 'unknown'
} as const

export const SPCCountryType = {
  FIJI: 'FIJI',
  KIRIBATI: 'KIRIBATI',
  NAURU: 'NAURU',
  NIUE: 'NIUE',
  PALAU: 'PALAU',
  TONGA: 'TONGA',
  TUVALU: 'TUVALU'
} as const

const spcCountryMessageDescriptors = {
  FIJI: {
    defaultMessage: 'Fiji',
    description: '',
    id: 'spcRegionalGroup.fiji'
  },
  KIRIBATI: {
    defaultMessage: 'Kiribati',
    description: '',
    id: 'spcRegionalGroup.kiribati'
  },
  NAURU: {
    defaultMessage: 'Nauru',
    description: '',
    id: 'spcRegionalGroup.nauru'
  },
  PALAU: {
    defaultMessage: 'Palau',
    description: '',
    id: 'spcRegionalGroup.palau'
  },
  NIUE: {
    defaultMessage: 'Niue',
    description: '',
    id: 'spcRegionalGroup.niue'
  },
  TONGA: {
    defaultMessage: 'Tonga',
    description: '',
    id: 'spcRegionalGroup.tonga'
  },
  TUVALU: {
    defaultMessage: 'Tuvalu',
    description: '',
    id: 'spcRegionalGroup.tuvalu'
  }
} satisfies Record<keyof typeof SPCCountryType, TranslationConfig>

const spcCountryOptions = createSelectOptions(
  SPCCountryType,
  spcCountryMessageDescriptors
)

export const FijiAdmin1Type = {
  CENTRAL: 'CENTRAL',
  EASTERN: 'EASTERN',
  NORTHERN: 'NORTHERN',
  WESTERN: 'WESTERN'
} as const

const fijiAdmin1MessageDescriptors = {
  CENTRAL: {
    defaultMessage: 'Central',
    description: '',
    id: 'spcRegionalGroup.CENTRAL'
  },
  EASTERN: {
    defaultMessage: 'Eastern',
    description: '',
    id: 'spcRegionalGroup.EASTERN'
  },
  NORTHERN: {
    defaultMessage: 'Northern',
    description: '',
    id: 'spcRegionalGroup.NORTHERN'
  },
  WESTERN: {
    defaultMessage: 'Western',
    description: '',
    id: 'spcRegionalGroup.WESTERN'
  }
} satisfies Record<keyof typeof FijiAdmin1Type, TranslationConfig>

export const TongaAdmin1Type = {
  TONGATAPU: 'TONGATAPU',
  VAVAU: 'VAVAU',
  HAAPAI: 'HAAPAI',
  EUA: 'EUA',
  NIUAS: 'NIUAS'
} as const

const tongaAdmin1MessageDescriptors = {
  TONGATAPU: {
    defaultMessage: 'Tongatapu',
    description: '',
    id: 'spcRegionalGroup.TONGATAPU'
  },
  VAVAU: {
    defaultMessage: "Vava'u",
    description: '',
    id: 'spcRegionalGroup.VAVAU'
  },
  HAAPAI: {
    defaultMessage: "Ha'apai",
    description: '',
    id: 'spcRegionalGroup.HAAPAI'
  },
  EUA: {
    defaultMessage: "'Eua",
    description: '',
    id: 'spcRegionalGroup.EUA'
  },
  NIUAS: {
    defaultMessage: 'Niuas',
    description: '',
    id: 'spcRegionalGroup.NIUAS'
  }
} satisfies Record<keyof typeof TongaAdmin1Type, TranslationConfig>

export const KiribatiAdmin1Type = {
  GILBERT: 'GILBERT',
  PHOENIX: 'PHOENIX',
  LINE: 'LINE'
} as const

const kiribatiAdmin1MessageDescriptors = {
  GILBERT: {
    defaultMessage: 'Gilbert Islands',
    description: '',
    id: 'spcRegionalGroup.GILBERT'
  },
  PHOENIX: {
    defaultMessage: 'Phoenix Islands',
    description: '',
    id: 'spcRegionalGroup.PHOENIX'
  },
  LINE: {
    defaultMessage: 'Line Islands',
    description: '',
    id: 'spcRegionalGroup.LINE'
  }
} satisfies Record<keyof typeof KiribatiAdmin1Type, TranslationConfig>

export const NiueAdmin1Type = {
  MAKEFU: 'MAKEFU',
  TUAPA: 'TUAPA',
  NAMUKULU: 'NAMUKULU',
  HIKUTAVAKE: 'HIKUTAVAKE',
  TOI: 'TOI',
  MUTALAU: 'MUTALAU',
  LAKEPA: 'LAKEPA',
  LIKU: 'LIKU',
  HAKUPU: 'HAKUPU',
  VAIEA: 'VAIEA',
  AVATELE: 'AVATELE',
  TAMAKAUTOGA: 'TAMAKAUTOGA',
  ALOFI_S: 'ALOFI_S',
  ALOFI_N: 'ALOFI_N'
} as const

const niueAdmin1MessageDescriptors = {
  MAKEFU: {
    defaultMessage: 'Makefu',
    description: '',
    id: 'spcRegionalGroup.MAKEFU'
  },
  TUAPA: {
    defaultMessage: 'Tuapa',
    description: '',
    id: 'spcRegionalGroup.TUAPA'
  },
  NAMUKULU: {
    defaultMessage: 'Namukulu',
    description: '',
    id: 'spcRegionalGroup.NAMUKULU'
  },
  HIKUTAVAKE: {
    defaultMessage: 'Hikutavake',
    description: '',
    id: 'spcRegionalGroup.HIKUTAVAKE'
  },
  TOI: {
    defaultMessage: 'Toi',
    description: '',
    id: 'spcRegionalGroup.TOI'
  },
  MUTALAU: {
    defaultMessage: 'Mutalau',
    description: '',
    id: 'spcRegionalGroup.MUTALAU'
  },
  LAKEPA: {
    defaultMessage: 'Lakepa',
    description: '',
    id: 'spcRegionalGroup.LAKEPA'
  },
  LIKU: {
    defaultMessage: 'Liku',
    description: '',
    id: 'spcRegionalGroup.LIKU'
  },
  HAKUPU: {
    defaultMessage: 'Hakupu',
    description: '',
    id: 'spcRegionalGroup.HAKUPU'
  },
  VAIEA: {
    defaultMessage: 'Vaiea',
    description: '',
    id: 'spcRegionalGroup.VAIEA'
  },
  AVATELE: {
    defaultMessage: 'Avatele',
    description: '',
    id: 'spcRegionalGroup.AVATELE'
  },
  TAMAKAUTOGA: {
    defaultMessage: 'Tamakautoga',
    description: '',
    id: 'spcRegionalGroup.TAMAKAUTOGA'
  },
  ALOFI_S: {
    defaultMessage: 'Alofi South',
    description: '',
    id: 'spcRegionalGroup.ALOFI_S'
  },
  ALOFI_N: {
    defaultMessage: 'Alofi North',
    description: '',
    id: 'spcRegionalGroup.ALOFI_N'
  }
} satisfies Record<keyof typeof NiueAdmin1Type, TranslationConfig>

export const PalauAdmin1Type = {
  KAYANGEL: 'KAYANGEL',
  NGARCHELONG: 'NGARCHELONG',
  NGARAARD: 'NGARAARD',
  NGARDMAU: 'NGARDMAU',
  NGAREMLENGUI: 'NGAREMLENGUI',
  NGATPANG: 'NGATPANG',
  NGIWAL: 'NGIWAL',
  MELEKEOK: 'MELEKEOK',
  NGCHESAR: 'NGCHESAR',
  AIMELIIK: 'AIMELIIK',
  AIRAI: 'AIRAI',
  KOROR: 'KOROR',
  PELELIU: 'PELELIU',
  ANGAUR: 'ANGAUR',
  SONSOROL: 'SONSOROL',
  HATOHOBEI: 'HATOHOBEI'
} as const

const palauAdmin1MessageDescriptors = {
  KAYANGEL: {
    defaultMessage: 'Kayangel',
    description: '',
    id: 'spcRegionalGroup.KAYANGEL'
  },
  NGARCHELONG: {
    defaultMessage: 'Ngarchelong',
    description: '',
    id: 'spcRegionalGroup.NGARCHELONG'
  },
  NGARAARD: {
    defaultMessage: 'Ngaraard',
    description: '',
    id: 'spcRegionalGroup.NGARAARD'
  },
  NGARDMAU: {
    defaultMessage: 'Ngardmau',
    description: '',
    id: 'spcRegionalGroup.NGARDMAU'
  },
  NGAREMLENGUI: {
    defaultMessage: 'Ngaremlengui',
    description: '',
    id: 'spcRegionalGroup.NGAREMLENGUI'
  },
  NGATPANG: {
    defaultMessage: 'Ngatpang',
    description: '',
    id: 'spcRegionalGroup.NGATPANG'
  },
  NGIWAL: {
    defaultMessage: 'Ngiwal',
    description: '',
    id: 'spcRegionalGroup.NGIWAL'
  },
  MELEKEOK: {
    defaultMessage: 'Melekeok',
    description: '',
    id: 'spcRegionalGroup.MELEKEOK'
  },
  NGCHESAR: {
    defaultMessage: 'Ngchesar',
    description: '',
    id: 'spcRegionalGroup.NGCHESAR'
  },
  AIMELIIK: {
    defaultMessage: 'Aimeliik',
    description: '',
    id: 'spcRegionalGroup.AIMELIIK'
  },
  AIRAI: {
    defaultMessage: 'Airai',
    description: '',
    id: 'spcRegionalGroup.AIRAI'
  },
  KOROR: {
    defaultMessage: 'Koror',
    description: '',
    id: 'spcRegionalGroup.KOROR'
  },
  PELELIU: {
    defaultMessage: 'Peleliu',
    description: '',
    id: 'spcRegionalGroup.PELELIU'
  },
  ANGAUR: {
    defaultMessage: 'Angaur',
    description: '',
    id: 'spcRegionalGroup.ANGAUR'
  },
  SONSOROL: {
    defaultMessage: 'Sonsorol',
    description: '',
    id: 'spcRegionalGroup.SONSOROL'
  },
  HATOHOBEI: {
    defaultMessage: 'Hatohobei',
    description: '',
    id: 'spcRegionalGroup.HATOHOBEI'
  }
} satisfies Record<keyof typeof PalauAdmin1Type, TranslationConfig>

const fijiAdmin1Options = createSelectOptions(
  FijiAdmin1Type,
  fijiAdmin1MessageDescriptors
)

const tongaAdmin1Options = createSelectOptions(
  TongaAdmin1Type,
  tongaAdmin1MessageDescriptors
)

const kiribatiAdmin1Options = createSelectOptions(
  KiribatiAdmin1Type,
  kiribatiAdmin1MessageDescriptors
)

const niueAdmin1Options = createSelectOptions(
  NiueAdmin1Type,
  niueAdmin1MessageDescriptors
)

const palauAdmin1Options = createSelectOptions(
  PalauAdmin1Type,
  palauAdmin1MessageDescriptors
)

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
      required: false,
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
      id: `deceased.deceasedAge`,
      type: FieldType.NUMBER,
      required: false,
      analytics: true,
      label: {
        defaultMessage: `Age`,
        description: 'This is the label for the field',
        id: 'event.death.action.declare.form.section.deceased.field.age.label'
      },
      validation: [
        {
          validator: field('deceased.deceasedAge').isBetween(0, 120),
          message: {
            defaultMessage: 'Age must be between 0 and 120',
            description: 'Error message for invalid age',
            id: 'event.death.action.declare.form.section.deceased.field.age.error'
          }
        }
      ]
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
      id: 'eventDetails.immediateCauseOfDeath',
      type: FieldType.PARAGRAPH,
      label: {
        defaultMessage: 'Place of death',
        description: 'This is the label for the field',
        id: 'event.death.action.declare.form.section.event.field.addressHelper.label'
      },
      configuration: { styles: { fontVariant: 'h3' } }
    },
    {
      id: `deceased.country`,
      type: FieldType.SELECT,
      required: true,
      analytics: true,
      label: {
        defaultMessage: 'Country',
        description: 'This is the label for the field',
        id: `field.address.country.label`
      },
      options: spcCountryOptions
    },
    {
      id: `deceased.fijiAdmin1`,
      type: FieldType.SELECT,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Island / District / Village',
        description: 'This is the label for the field',
        id: `field.address.province.label`
      },
      options: fijiAdmin1Options,
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: field('deceased.country').isEqualTo(SPCCountryType.FIJI)
        }
      ]
    },
    {
      id: `deceased.tongaAdmin1`,
      type: FieldType.SELECT,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Island / District / Village',
        description: 'This is the label for the field',
        id: `field.address.province.label`
      },
      options: tongaAdmin1Options,
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: field('deceased.country').isEqualTo(SPCCountryType.TONGA)
        }
      ]
    },
    {
      id: `deceased.kiribatiAdmin1`,
      type: FieldType.SELECT,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Island / District / Village',
        description: 'This is the label for the field',
        id: `field.address.province.label`
      },
      options: kiribatiAdmin1Options,
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: field('deceased.country').isEqualTo(
            SPCCountryType.KIRIBATI
          )
        }
      ]
    },
    {
      id: `deceased.niueAdmin1`,
      type: FieldType.SELECT,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Island / District / Village',
        description: 'This is the label for the field',
        id: `field.address.province.label`
      },
      options: niueAdmin1Options,
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: field('deceased.country').isEqualTo(SPCCountryType.NIUE)
        }
      ]
    },
    {
      id: `deceased.palauAdmin1`,
      type: FieldType.SELECT,
      required: false,
      analytics: true,
      label: {
        defaultMessage: 'Island / District / Village',
        description: 'This is the label for the field',
        id: `field.address.province.label`
      },
      options: palauAdmin1Options,
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: field('deceased.country').isEqualTo(SPCCountryType.PALAU)
        }
      ]
    }
  ]
})
