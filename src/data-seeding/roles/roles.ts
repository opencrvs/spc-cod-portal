import { SCOPES, Scope } from '@opencrvs/toolkit/scopes'
import { MessageDescriptor } from 'react-intl'

type Role = {
  id: string
  label: MessageDescriptor
  scopes: Scope[]
}

export const roles: Role[] = [
  {
    id: 'MR_OFFICER', // equivalent to REGISTRATION_AGENT
    label: {
      defaultMessage: 'Medical Records Officer',
      description: 'Name for user role Medical Records Officer',
      id: 'userRole.medicalRecordsOfficer'
    },
    scopes: [
      SCOPES.RECORD_READ,
      SCOPES.PERFORMANCE_READ,
      SCOPES.ORGANISATION_READ_LOCATIONS_MY_OFFICE,
      SCOPES.USER_READ_MY_JURISDICTION,
      SCOPES.ORGANISATION_READ_LOCATIONS_MY_JURISDICTION,
      SCOPES.RECORD_PRINT_ISSUE_CERTIFIED_COPIES,
      SCOPES.PERFORMANCE_READ_DASHBOARDS,
      'type=record.search&event=death',
      'workqueue[id=assigned-to-you|recent|requires-completion|requires-updates-office|in-review|encoded]',
      'type=record.create&event=death&placeOfEvent=administrativeArea',
      'type=record.read&event=death',
      'type=record.declare&event=death',
      'type=record.edit&event=death',
      'type=record.reject&event=death',
      'type=record.archive&event=death',
      'type=record.print-certified-copies&event=death',
      'type=record.request-correction&event=death',
      'type=record.custom-action&event=death&customActionTypes=VALIDATE_DECLARATION',
      'dashboard.view[id=statistics]'
    ]
  },
  {
    id: 'NATIONAL_SYSTEM_ADMIN',
    label: {
      defaultMessage: 'National System Admin',
      description: 'Name for user role National System Admin',
      id: 'userRole.nationalSystemAdmin'
    },
    scopes: [
      SCOPES.CONFIG_UPDATE_ALL,
      SCOPES.USER_CREATE,
      'user.create[role=MR_OFFICER|CODING_OFFICER|NATIONAL_SYSTEM_ADMIN]',
      'user.edit[role=MR_OFFICER|CODING_OFFICER|NATIONAL_SYSTEM_ADMIN]',
      SCOPES.USER_READ,
      SCOPES.USER_UPDATE,
      SCOPES.ORGANISATION_READ_LOCATIONS,
      SCOPES.PERFORMANCE_READ,
      SCOPES.RECORD_REINDEX,
      SCOPES.PERFORMANCE_READ_DASHBOARDS
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
      SCOPES.RECORD_READ,
      SCOPES.PERFORMANCE_READ,
      SCOPES.ORGANISATION_READ_LOCATIONS,
      SCOPES.PERFORMANCE_READ_DASHBOARDS,
      SCOPES.USER_READ_ONLY_MY_AUDIT,
      SCOPES.ORGANISATION_READ_LOCATIONS,
      SCOPES.USER_READ,
      'type=record.search&event=death',
      'workqueue[id=assigned-to-you|recent|requires-updates-office|in-review-all|encoded]',
      'type=record.create&event=death',
      'type=record.read&event=death',
      'type=record.declare&event=death',
      'type=record.edit&event=death',
      'type=record.reject&event=death',
      'type=record.archive&event=death',
      'type=record.review-duplicates&event=death',
      'type=record.register&event=death',
      'type=record.print-certified-copies&event=death',
      'type=record.correct&event=death',
      'type=record.unassign-others&event=death'
    ]
  }
]
