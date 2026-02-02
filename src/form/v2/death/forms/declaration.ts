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

import { defineDeclarationForm, FieldType } from '@opencrvs/toolkit/events'
import { deceased } from './pages/deceased'
import { irisOutput } from './pages/irisOutput'
import { eventDetails } from './pages/eventDetails'

export const DEATH_DECLARATION_REVIEW = {
  title: {
    id: 'event.death.action.declare.form.review.title',
    defaultMessage: 'Death coding for {deceased.certificateKey}',
    description: 'Title of the form to show in review page'
  },
  fields: [
    {
      id: 'review.comment',
      type: FieldType.TEXTAREA,
      label: {
        defaultMessage: 'Comment',
        id: 'event.death.action.declare.form.review.comment.label',
        description: 'Label for the comment field in the review section'
      },
      required: false
    }
  ]
}

export const DEATH_DECLARATION_FORM = defineDeclarationForm({
  label: {
    defaultMessage: 'Death coding form',
    id: 'event.death.action.declare.form.label',
    description: 'This is what this form is referred as in the system'
  },

  pages: [deceased, eventDetails, irisOutput]
})
