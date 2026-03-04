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
      SCOPES.RECORD_DECLARE_DEATH,
      SCOPES.RECORD_DECLARATION_EDIT,
      SCOPES.RECORD_SUBMIT_FOR_UPDATES,
      SCOPES.RECORD_DECLARATION_ARCHIVE,
      SCOPES.RECORD_DECLARATION_REINSTATE,
      SCOPES.RECORD_PRINT_ISSUE_CERTIFIED_COPIES,
      SCOPES.PERFORMANCE_READ,
      SCOPES.PERFORMANCE_READ_DASHBOARDS,
      SCOPES.ORGANISATION_READ_LOCATIONS_MY_OFFICE,
      SCOPES.SEARCH_DEATH,
      'search[event=death,access=all]',
      'workqueue[id=assigned-to-you|recent|requires-completion|requires-updates-office|in-review|encoded]',
      'record.create[event=death]',
      'record.read[event=death]',
      'record.declare[event=death]',
      'record.declared.reject[event=death]',
      'record.declared.archive[event=death]',
      'record.declared.review-duplicates[event=death]',
      'record.registered.correct[event=death]',
      'record.unassign-others[event=death]',
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
      SCOPES.USER_CREATE,
      'user.create[role=MR_OFFICER|CODING_OFFICER|NATIONAL_SYSTEM_ADMIN]',
      'user.edit[role=MR_OFFICER|CODING_OFFICER|NATIONAL_SYSTEM_ADMIN]',
      SCOPES.USER_READ,
      SCOPES.USER_UPDATE,
      SCOPES.ORGANISATION_READ_LOCATIONS,
      SCOPES.PERFORMANCE_READ,
      SCOPES.PERFORMANCE_READ_DASHBOARDS,
      SCOPES.PERFORMANCE_EXPORT_VITAL_STATISTICS,
      SCOPES.RECORD_REINDEX,
      SCOPES.CONFIG_UPDATE_ALL
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
      SCOPES.RECORD_DECLARE_BIRTH,
      SCOPES.RECORD_DECLARE_DEATH,
      SCOPES.RECORD_DECLARE_MARRIAGE,
      SCOPES.RECORD_SUBMIT_FOR_UPDATES,
      SCOPES.RECORD_REVIEW_DUPLICATES,
      SCOPES.RECORD_DECLARATION_ARCHIVE,
      SCOPES.RECORD_DECLARATION_REINSTATE,
      SCOPES.RECORD_REGISTER,
      SCOPES.RECORD_REGISTRATION_CORRECT,
      SCOPES.RECORD_UNASSIGN_OTHERS,
      SCOPES.RECORD_CONFIRM_REGISTRATION,
      SCOPES.RECORD_REJECT_REGISTRATION,
      SCOPES.PERFORMANCE_READ,
      SCOPES.PERFORMANCE_READ_DASHBOARDS,
      SCOPES.PERFORMANCE_EXPORT_VITAL_STATISTICS,
      SCOPES.USER_READ_ONLY_MY_AUDIT,
      SCOPES.ORGANISATION_READ_LOCATIONS_MY_OFFICE,
      SCOPES.USER_READ_MY_OFFICE,
      SCOPES.SEARCH_BIRTH,
      SCOPES.SEARCH_DEATH,
      SCOPES.SEARCH_MARRIAGE,
      'search[event=death,access=all]',
      'workqueue[id=assigned-to-you|recent|requires-updates-office|in-review-all|encoded]',
      'record.create[event=death]',
      'record.read[event=death]',
      'record.declare[event=death]',
      'record.declared.reject[event=death]',
      'record.declared.archive[event=death]',
      'record.declared.review-duplicates[event=death]',
      'record.register[event=death]',
      'record.registered.correct[event=death]',
      'dashboard.view[id=uploader|export|statistics]',
      'record.unassign-others[event=death]',
      'record.declared.edit[event=death]'
    ]
  }
]
