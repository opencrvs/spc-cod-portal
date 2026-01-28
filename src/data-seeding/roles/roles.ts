import { SCOPES, Scope } from '@opencrvs/toolkit/scopes'
import { MessageDescriptor } from 'react-intl'

type Role = {
  id: string
  label: MessageDescriptor
  scopes: Scope[]
}

export const roles: Role[] = [
  {
    id: 'MR_OFFICER', // equivalent to LOCAL REGISTRAR
    label: {
      defaultMessage: 'Medical Records Officer',
      description: 'Name for user role Medical Records Officer',
      id: 'userRole.medicalRecordsOfficer'
    },
    scopes: [
      SCOPES.RECORD_READ,
      SCOPES.RECORD_DECLARE_BIRTH,
      SCOPES.RECORD_DECLARE_DEATH,
      SCOPES.RECORD_DECLARE_MARRIAGE,
      SCOPES.RECORD_SUBMIT_FOR_UPDATES,
      SCOPES.RECORD_UNASSIGN_OTHERS,
      SCOPES.RECORD_DECLARATION_EDIT,
      SCOPES.RECORD_DECLARATION_ARCHIVE,
      SCOPES.RECORD_DECLARATION_REINSTATE,
      SCOPES.RECORD_REVIEW_DUPLICATES,
      SCOPES.RECORD_REGISTER,
      SCOPES.RECORD_PRINT_ISSUE_CERTIFIED_COPIES,
      SCOPES.PROFILE_ELECTRONIC_SIGNATURE,
      SCOPES.RECORD_REGISTRATION_CORRECT,
      SCOPES.RECORD_CONFIRM_REGISTRATION,
      SCOPES.RECORD_REJECT_REGISTRATION,
      SCOPES.PERFORMANCE_READ,
      SCOPES.PERFORMANCE_READ_DASHBOARDS,
      SCOPES.PROFILE_ELECTRONIC_SIGNATURE,
      SCOPES.USER_READ_ONLY_MY_AUDIT,
      SCOPES.ORGANISATION_READ_LOCATIONS_MY_OFFICE,
      SCOPES.PERFORMANCE_EXPORT_VITAL_STATISTICS,
      SCOPES.SEARCH_BIRTH,
      SCOPES.SEARCH_DEATH,
      SCOPES.SEARCH_MARRIAGE,
      'search[event=death,access=my-jurisdiction]',
      'workqueue[id=assigned-to-you|recent|requires-completion|requires-updates-office|ready-for-coding]',
      'record.create[event=death]',
      'record.read[event=death]',
      'record.declare[event=death]',
      'record.declared.reject[event=death]',
      'record.declared.archive[event=death]',
      'record.declared.review-duplicates[event=death]',
      'record.register[event=death]',
      'record.registered.correct[event=death]',
      'record.unassign-others[event=death]'
    ]
  },
  {
    id: 'NATIONAL_SYSTEM_ADMIN',
    label: {
      defaultMessage: 'National Administrator',
      description: 'Name for user role National Administrator',
      id: 'userRole.nationalAdministrator'
    },
    scopes: [
      SCOPES.CONFIG_UPDATE_ALL,
      SCOPES.ORGANISATION_READ_LOCATIONS,
      SCOPES.USER_CREATE,
      'user.create[role=MR_OFFICER|CODING_OFFICER|NATIONAL_SYSTEM_ADMIN]',
      'user.edit[role=MR_OFFICER|CODING_OFFICER|NATIONAL_SYSTEM_ADMIN]',
      SCOPES.USER_READ,
      SCOPES.USER_UPDATE,
      SCOPES.USER_READ,
      SCOPES.PERFORMANCE_READ,
      SCOPES.PERFORMANCE_READ_DASHBOARDS,
      SCOPES.PERFORMANCE_EXPORT_VITAL_STATISTICS,
      SCOPES.RECORD_REINDEX,
      SCOPES.CONFIG_UPDATE_ALL
    ]
  },
  {
    id: 'CODING_OFFICER', // Equivalent to NATIONA_REGISTRAR
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
      SCOPES.RECORD_UNASSIGN_OTHERS,
      SCOPES.RECORD_DECLARATION_EDIT,
      SCOPES.RECORD_DECLARATION_ARCHIVE,
      SCOPES.RECORD_DECLARATION_REINSTATE,
      SCOPES.RECORD_REVIEW_DUPLICATES,
      SCOPES.RECORD_REGISTER,
      SCOPES.RECORD_REGISTRATION_CORRECT,
      SCOPES.RECORD_UNASSIGN_OTHERS,
      SCOPES.RECORD_CONFIRM_REGISTRATION,
      SCOPES.RECORD_REJECT_REGISTRATION,
      SCOPES.PERFORMANCE_READ,
      SCOPES.PERFORMANCE_READ_DASHBOARDS,
      SCOPES.PERFORMANCE_EXPORT_VITAL_STATISTICS,
      SCOPES.USER_READ_ONLY_MY_AUDIT,
      SCOPES.PROFILE_ELECTRONIC_SIGNATURE,
      SCOPES.ORGANISATION_READ_LOCATIONS_MY_OFFICE,
      SCOPES.USER_READ_MY_OFFICE,
      SCOPES.SEARCH_BIRTH,
      SCOPES.SEARCH_DEATH,
      SCOPES.SEARCH_MARRIAGE,
      'search[event=death,access=all]',
      'workqueue[id=assigned-to-you|recent|requires-completion|requires-updates-office|in-review-all]',
      'record.create[event=death]',
      'record.read[event=death]',
      'record.declare[event=death]',
      'record.declared.reject[event=death]',
      'record.declared.archive[event=death]',
      'record.declared.review-duplicates[event=death]',
      'record.register[event=death]',
      'record.registered.correct[event=death]',
      'record.unassign-others[event=death]'
    ]
  },
  {
    id: 'PROVINCIAL_REGISTRAR',
    label: {
      defaultMessage: 'Provincial Registrar',
      description: 'Name for user role Provincial Registrar',
      id: 'userRole.provincialRegistrar'
    },
    scopes: [
      'record.read[event=birth|death|tennis-club-membership]',
      'record.custom-action[event=birth,customActionType=APPROVE_DECLARATION|PROVINCIAL_REGISTER_FEEDBACK]',
      'workqueue[id=late-registration-approval-required|recent|pending-feedback-provincinal-registrar|pending-approval|correction-requested]',
      'search[event=birth,access=all]'
    ]
  },
  {
    id: 'HOSPITAL_CLERK',
    label: {
      defaultMessage: 'Hospital Clerk',
      description: 'Name for user role Hospital Clerk',
      id: 'userRole.hospitalClerk'
    },
    scopes: [
      SCOPES.RECORD_DECLARE_BIRTH,
      SCOPES.RECORD_DECLARE_DEATH,
      SCOPES.RECORD_SUBMIT_INCOMPLETE,
      SCOPES.RECORD_SUBMIT_FOR_REVIEW,
      SCOPES.SEARCH_BIRTH,
      SCOPES.SEARCH_DEATH,
      SCOPES.USER_READ_ONLY_MY_AUDIT,
      'search[event=birth,access=all]',
      'search[event=death,access=all]',
      'search[event=tennis-club-membership,access=all]',
      'workqueue[id=assigned-to-you|recent|pending-updates]',
      'record.create[event=birth|death|tennis-club-membership]',
      'record.read[event=birth|death|tennis-club-membership]',
      'record.declare[event=birth|death|tennis-club-membership]',
      'record.notify[event=birth|death|tennis-club-membership]',
      'record.declared.edit[event=birth|death|tennis-club-membership]'
    ]
  },
  {
    id: 'COMMUNITY_LEADER',
    label: {
      defaultMessage: 'Community Leader',
      description: 'Name for user role Community Leader',
      id: 'userRole.communityLeader'
    },
    scopes: [
      SCOPES.RECORD_DECLARE_BIRTH,
      SCOPES.RECORD_DECLARE_DEATH,
      SCOPES.RECORD_DECLARE_MARRIAGE,
      SCOPES.RECORD_SUBMIT_INCOMPLETE,
      SCOPES.RECORD_SUBMIT_FOR_REVIEW,
      SCOPES.RECORD_PRINT_ISSUE_CERTIFIED_COPIES,
      SCOPES.SEARCH_BIRTH,
      SCOPES.SEARCH_DEATH,
      SCOPES.SEARCH_MARRIAGE,
      SCOPES.USER_READ_ONLY_MY_AUDIT,
      'search[event=birth,access=all]',
      'search[event=death,access=all]',
      'search[event=tennis-club-membership,access=all]',
      'workqueue[id=assigned-to-you|recent]',
      'record.create[event=birth|death|tennis-club-membership]',
      'record.read[event=birth|death|tennis-club-membership]',
      'record.declare[event=birth|death|tennis-club-membership]',
      'record.declared.edit[event=birth|death|tennis-club-membership]',
      'record.notify[event=birth|death|tennis-club-membership]',
      'record.registered.print-certified-copies[event=birth|death|tennis-club-membership]'
    ]
  }
]
