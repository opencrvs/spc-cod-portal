import { defineActionForm, PageTypes } from '@opencrvs/toolkit/events'

export const DEATH_CORRECTION_FORM = defineActionForm({
  label: {
    id: 'event.death.action.correction.form.label',
    defaultMessage: 'Correct coding record',
    description: 'This is the label for the death correction form'
  },
  pages: [
    {
      id: 'details',
      type: PageTypes.enum.FORM,
      requireCompletionToContinue: true,
      title: {
        id: 'event.death.action.correction.form.section.details.title',
        defaultMessage: 'Correction details',
        description: 'This is the title of the section'
      },
      fields: [
        {
          id: 'correction.requester.relationshop.intro',
          type: 'PAGE_HEADER',
          label: {
            id: 'correction.requester.relationshop.intro.label',
            defaultMessage:
              'Note: In the case that the child is now of legal age (18) then only they should be able to request a change to their birth record.',
            description: 'The title for the corrector form'
          }
        },
        {
          id: 'correction.requester.relationship',
          type: 'RADIO_GROUP',
          label: {
            id: 'correction.corrector.title',
            defaultMessage: 'Who is requesting a change to this record?',
            description: 'The title for the corrector form'
          },
          defaultValue: '',
          options: [
            {
              value: 'MR_OFFICER',
              label: {
                defaultMessage: 'Medical Records Officer',
                description: 'Name for user role Medical Records Officer',
                id: 'userRole.medicalRecordsOfficer'
              }
            },
            {
              value: 'CODING_OFFICER',
              label: {
                defaultMessage: 'Regional Coding Officer',
                description: 'Name for user role Regional Coding Officer',
                id: 'userRole.regionalCodingOfficer'
              }
            },
            {
              value: 'OTHER',
              label: {
                id: 'correction.corrector.others',
                defaultMessage: 'Someone else',
                description:
                  'Label for someone else option in certificate correction form'
              }
            }
          ]
        }
      ]
    },
    {
      id: 'correction-request.additional-details',
      type: PageTypes.enum.FORM,
      requireCompletionToContinue: true,
      title: {
        id: 'event.tennis-club-membership.action.requestCorrection.form.section.corrector',
        defaultMessage: 'Reason for correction',
        description: 'This is the title of the section'
      },
      fields: [
        {
          id: 'correction.request.reason',
          type: 'TEXT',
          label: {
            id: 'correction.reason.title',
            defaultMessage: 'Reason for correction?',
            description: 'The title for the corrector form'
          }
        }
      ]
    }
  ]
})
