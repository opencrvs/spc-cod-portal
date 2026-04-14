import { defineActionForm, PageTypes } from '@opencrvs/toolkit/events'

export const DEATH_CORRECTION_FORM = defineActionForm({
  label: {
    id: 'event.death.action.correction.form.label',
    defaultMessage: 'Correct coding record',
    description: 'This is the label for the death correction form'
  },
  pages: [
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
          type: 'TEXTAREA',
          required: true,
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
