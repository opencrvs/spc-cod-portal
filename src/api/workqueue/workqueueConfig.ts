import {
  // ActionStatus,
  ActionType,
  EventStatus,
  InherentFlags,
  defineWorkqueues,
  event,
  user
} from '@opencrvs/toolkit/events'

const DATE_OF_EVENT_COLUMN = {
  label: {
    id: 'workqueues.dateOfEvent',
    defaultMessage: 'Date of Event',
    description: 'Label for workqueue column: dateOfEvent'
  },
  value: event.field('dateOfEvent')
}

const createdInMyAdminArea = {
  createdAtLocation: {
    type: 'within',
    location: user('primaryOfficeId')
  }
} as const

const declaredInMyAdminArea = {
  ['legalStatuses.DECLARED.createdAtLocation']: {
    type: 'within',
    location: user('primaryOfficeId')
  }
} as const

// const registeredInMyAdminArea = {
//   ['legalStatuses.REGISTERED.createdAtLocation']: {
//     type: 'within',
//     location: user('primaryOfficeId')
//   }
// } as const

export const Workqueues = defineWorkqueues([
  {
    slug: 'assigned-to-you',
    icon: 'PushPin',
    name: {
      id: 'workqueues.assignedToYou.title',
      defaultMessage: 'Assigned to you',
      description: 'Title of assigned to you workqueue'
    },
    query: { assignedTo: { type: 'exact', term: user('id') } },
    actions: [{ type: ActionType.READ }]
  },
  {
    slug: 'recent',
    icon: 'Timer',
    name: {
      id: 'workqueues.recent.title',
      defaultMessage: 'Recent',
      description: 'Title of recent workqueue'
    },
    query: {
      updatedBy: { type: 'exact', term: user('id') },
      updatedAt: { type: 'timePeriod', term: 'last7Days' }
    },
    actions: [{ type: ActionType.READ }],
    emptyMessage: {
      id: 'workqueues.recent.emptyMessage',
      defaultMessage: 'No recent records',
      description: 'Empty message for recent workqueue'
    }
  },
  {
    slug: 'pending-validation',
    icon: 'Stamp',
    name: {
      id: 'workqueues.pendingValidation.title',
      defaultMessage: 'Pending validation',
      description: 'Title of pending validation workqueue'
    },
    query: {
      ...declaredInMyAdminArea,
      status: { type: 'exact', term: EventStatus.enum.DECLARED },
      flags: {
        noneOf: [
          InherentFlags.REJECTED,
          'validated',
          'approval-required-for-late-registration'
        ]
      }
    },
    actions: [{ type: ActionType.READ }],
    columns: [
      DATE_OF_EVENT_COLUMN,
      {
        label: {
          defaultMessage: 'Validation requested',
          description: 'This is the label for the validation requested column',
          id: 'workqueue.pending-validation.updatedAtColumn'
        },
        value: event.field('updatedAt')
      }
    ]
  },

  {
    slug: 'ready-for-coding', // actually a re-purposed workqueue for ready to print
    icon: 'FileSearch',
    name: {
      id: 'workqueues.inReview.title',
      defaultMessage: 'Ready for coding',
      description: 'Title of ready for review workqueue'
    },
    query: {
      flags: {
        noneOf: [InherentFlags.CORRECTION_REQUESTED],
        anyOf: ['pending-first-certificate-issuance']
      },
      status: { type: 'exact', term: 'REGISTERED' },
      updatedAtLocation: { type: 'within', location: user('primaryOfficeId') }
    },
    actions: [],
    columns: [
      DATE_OF_EVENT_COLUMN,
      {
        label: {
          defaultMessage: 'Registered',
          description: 'This is the label for the workqueue column',
          id: 'workqueue.ready-to-print.column.registered'
        },
        value: event.field('updatedAt')
      }
    ]
  },
  {
    slug: 'pending-updates',
    icon: 'FileX',
    name: {
      id: 'workqueues.inReviewAll.title',
      defaultMessage: 'Ready for coding',
      description: 'Title of ready for review (all) workqueue'
    },
    query: {
      ...createdInMyAdminArea,
      flags: { anyOf: [InherentFlags.REJECTED] }
    },
    actions: [{ type: ActionType.READ }],
    columns: [
      DATE_OF_EVENT_COLUMN,
      {
        label: {
          defaultMessage: 'Update requested',
          description: 'This is the label for the update requested column',
          id: 'workqueue.pending-updates.updatedAtColumn'
        },
        value: event.field('updatedAt')
      }
    ]
  },
  {
    slug: 'pending-approval',
    icon: 'Stamp',
    name: {
      id: 'workqueues.requiresApproval.title',
      defaultMessage: 'Pending approval',
      description: 'Title of Pending approval workqueue'
    },
    columns: [
      DATE_OF_EVENT_COLUMN,
      {
        label: {
          defaultMessage: 'Approval requested',
          description:
            'This is the label for the pending approval workqueue column',
          id: 'workqueue.late-registration-approval.column.approval-requested'
        },
        value: event.field('updatedAt')
      }
    ],
    query: {
      ...declaredInMyAdminArea,
      status: { type: 'exact', term: EventStatus.enum.DECLARED },
      flags: { anyOf: ['approval-required-for-late-registration'] }
    },
    actions: [{ type: ActionType.READ }]
  },
  {
    slug: 'pending-registration',
    icon: 'PenNib',
    name: {
      id: 'workqueues.pendingRegistration.title',
      defaultMessage: 'Pending registration',
      description: 'Title of pending registration workqueue'
    },
    query: {
      ...declaredInMyAdminArea,
      status: { type: 'exact', term: EventStatus.enum.DECLARED },
      flags: {
        anyOf: ['validated'],
        noneOf: ['approval-required-for-late-registration']
      }
    },
    actions: [{ type: ActionType.READ }],
    columns: [
      DATE_OF_EVENT_COLUMN,
      {
        label: {
          defaultMessage: 'Registration requested',
          description:
            'This is the label for the registration requested column',
          id: 'workqueue.pending-registration.updatedAtColumn'
        },
        value: event.field('updatedAt')
      }
    ]
  },
  {
    slug: 'registration-registrar-general',
    icon: 'PenNib',
    name: {
      id: 'workqueues.pendingRegistration.title',
      defaultMessage: 'Pending registration',
      description: 'Title of pending registration workqueue'
    },
    query: { status: { type: 'exact', term: EventStatus.enum.DECLARED } },
    actions: [{ type: ActionType.READ }],
    columns: [
      DATE_OF_EVENT_COLUMN,
      {
        label: {
          defaultMessage: 'Registration requested',
          description:
            'This is the label for the registration requested column',
          id: 'workqueue.pending-registration.updatedAtColumn'
        },
        value: event.field('updatedAt')
      }
    ]
  },
  {
    slug: 'escalated',
    icon: 'FileArrowUp',
    name: {
      id: 'workqueues.escalated.title',
      defaultMessage: 'Escalated',
      description: 'Title of escalated workqueue'
    },
    query: {
      ...createdInMyAdminArea,
      flags: {
        anyOf: [
          'escalated-to-registrar-general',
          'escalated-to-provincial-registrar'
        ]
      }
    },
    actions: [{ type: ActionType.READ }],
    columns: [
      DATE_OF_EVENT_COLUMN,
      {
        label: {
          defaultMessage: 'Escalated',
          description: 'This is the label for the Escalated column',
          id: 'workqueue.escalated.updatedAtColumn'
        },
        value: event.field('updatedAt')
      }
    ]
  },
  {
    slug: 'pending-feedback-registrar-general',
    icon: 'ChatText',
    name: {
      id: 'workqueues.sentForApproval.title',
      defaultMessage: 'Sent for coding',
      description: 'Title of sent for approval workqueue'
    },
    query: { flags: { anyOf: ['escalated-to-registrar-general'] } },
    columns: [
      DATE_OF_EVENT_COLUMN,
      {
        label: {
          id: 'workqueues.reviewRequested.title',
          defaultMessage: 'Review requested',
          description: 'Title of review requested workqueue'
        },
        value: event.field('updatedAt')
      }
    ],
    actions: [{ type: ActionType.READ }]
  }
])
