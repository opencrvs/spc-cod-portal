import { MessageDescriptor } from 'react-intl'
import { defineScopes } from '@opencrvs/toolkit/scopes'

type Role = {
  id: string
  label: MessageDescriptor
  // @TODO: After the last v1 scopes (user.create and user.edit) are replaced by v2 scopes, change this to EncodedScope
  scopes: string[]
}

export const roles: Role[] = [
  {
    id: 'MR_OFFICER', // equivalent to REGISTRATION_AGENT
    label: {
      defaultMessage: 'Medical Records Officer',
      description: 'Name for user role Medical Records Officer',
      id: 'userRole.medicalRecordsOfficer'
    },
    scopes: defineScopes([
      { type: 'performance.read' },
      { type: 'organisation.read-locations'},
      { type: 'user.read', options: { accessLevel: 'location' } },
      { type: 'record.print-certified-copies' },
      { type: 'performance.read-dashboards' },
      { type: 'workqueue', options: { ids: ['assigned-to-you', 'recent', 'requires-completion', 'requires-updates-office', 'in-review', 'encoded' ] } },
      { type: 'record.create', options: { event: 'death', placeOfEvent: 'administrativeArea' } },
      { type: 'record.search', options: { event: 'death' } },
      { type: 'record.read', options: { event: 'death' } },
      { type: 'record.declare', options: { event: 'death' } },
      { type: 'record.edit', options: { event: 'death' } },
      { type: 'record.reject', options: { event: 'death' } },
      { type: 'record.archive', options: { event: 'death' } },
      { type: 'record.print-certified-copies', options: { event: 'death' } },
      { type: 'record.request-correction', options: { event: 'death' } }
      /* 'type=record.custom-action&event=death',
      'dashboard.view[id=statistics]' */
    ])
  },
  {
    id: 'NATIONAL_SYSTEM_ADMIN',
    label: {
      defaultMessage: 'National System Admin',
      description: 'Name for user role National System Admin',
      id: 'userRole.nationalSystemAdmin'
    },
    scopes: [
      ...defineScopes([
        { type: 'config.update-all' },
        { type: 'user.create' },
        { type: 'user.read' },
        { type: 'user.update-all' },
        { type: 'organisation.read-locations' },
        { type: 'performance.read' },
        { type: 'record.reindex' },
        { type: 'integration.create' },
        { type: 'performance.read-dashboards' }
      ]),
      'user.create[role=MR_OFFICER|CODING_OFFICER|NATIONAL_SYSTEM_ADMIN]',
      'user.edit[role=MR_OFFICER|CODING_OFFICER|NATIONAL_SYSTEM_ADMIN]'
    ]
  },
  {
    id: 'CODING_OFFICER', // Equivalent to NATIONAL_REGISTRAR
    label: {
      defaultMessage: 'Regional Coding Officer',
      description: 'Name for user role Regional Coding Officer',
      id: 'userRole.regionalCodingOfficer'
    },
    scopes: [
      { type: 'performance.read' },
      { type: 'organisation.read-locations' },
      { type: 'performance.read-dashboards' }
      { type: 'user.read-only-my-audit' },
      { type: 'user.read' },
      { type: 'record.search', options: { event: 'death' } },
      { type: 'workqueue', options: { ids: ['assigned-to-you', 'recent', 'requires-updates-office', 'in-review-all', 'encoded' ] } },
      { type: 'record.create', options: { event: 'death'} },
      { type: 'record.read', options: { event: 'death' } },
      { type: 'record.declare', options: { event: 'death' } },
      { type: 'record.edit', options: { event: 'death' } },
      { type: 'record.reject', options: { event: 'death' } },
      { type: 'record.archive', options: { event: 'death' } },
      { type: 'record.review-duplicates', options: { event: 'death' } },
      { type: 'record.register', options: { event: 'death' } },
      { type: 'record.print-certified-copies', options: { event: 'death' } },
      { type: 'record.correct', options: { event: 'death' } },
      { type: 'record.unassign-others', options: { event: 'death' } }
      /* 'dashboard.view[id=uploader|export|statistics]' */
    ]
  }
]
