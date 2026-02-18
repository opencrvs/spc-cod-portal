import {
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

export const Workqueues = defineWorkqueues([
  {
    slug: 'in-progress',
    icon: 'Draft',
    name: {
      id: 'workqueues.inProgress.title',
      defaultMessage: 'In progress',
      description: 'Title of in progress workqueue'
    },
    query: {},
    actions: [
      {
        type: 'DEFAULT'
      }
    ]
  },
  {
    slug: 'correction-requested',
    icon: 'FileSearch',
    name: {
      id: 'workqueues.correctionRequested.title',
      defaultMessage: 'Correction requested',
      description: 'Title of correction requested workqueue'
    },
    query: {},
    actions: [
      {
        type: 'READ'
      }
    ]
  },
  {
    slug: 'waiting-for-attestation',
    icon: 'FileSearch',
    name: {
      id: 'workqueues.waitingForAttestation.title',
      defaultMessage: 'Waiting for attestation',
      description: 'Title of waiting for attestation'
    },
    columns: [
      {
        label: {
          id: 'workqueues.waitingForAttestation.dateOfEvent',
          defaultMessage: 'Sent for your attestation',
          description:
            'Label for workqueue column: waitingForAttestation.dateOfEvent'
        },
        value: event.field('createdAt')
      },
      {
        label: {
          id: 'workqueues.eventStatus',
          defaultMessage: 'Status of the event',
          description: 'Label for workqueue column: eventStatus'
        },
        value: event.field('status')
      }
    ],
    actions: [],
    query: {}
  },
  {
    slug: 'assigned-to-you',
    icon: 'PushPin',
    name: {
      id: 'workqueues.assignedToYou.title',
      defaultMessage: 'Assigned to you',
      description: 'Title of assigned to you workqueue'
    },
    query: {
      assignedTo: { type: 'exact', term: user('id') }
    },
    actions: [
      {
        type: 'DEFAULT'
      }
    ]
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
      updatedAt: {
        type: 'timePeriod',
        term: 'last7Days'
      }
    },
    actions: [
      {
        type: 'DEFAULT'
      }
    ],
    emptyMessage: {
      id: 'workqueues.recent.emptyMessage',
      defaultMessage: 'No recent records',
      description: 'Empty message for recent workqueue'
    }
  },
  {
    slug: 'sent-for-review',
    icon: 'FileSearch',
    name: {
      id: 'workqueues.sentForReview.title',
      defaultMessage: 'Sent for review',
      description: 'Title of sent for review workqueue'
    },
    query: {
      status: {
        type: 'anyOf',
        terms: ['DECLARED', 'NOTIFIED']
      },
      flags: {
        noneOf: [InherentFlags.REJECTED]
      },
      createdBy: { type: 'exact', term: user('id') }
    },
    actions: [],
    columns: [
      DATE_OF_EVENT_COLUMN,
      {
        label: {
          defaultMessage: 'Sent for review',
          description: 'This is the label for the workqueue column',
          id: 'workqueue.sent-for-review.column.sent-for-review'
        },
        value: event.field('updatedAt')
      }
    ]
  },
  {
    slug: 'in-review',
    icon: 'FileSearch',
    name: {
      id: 'workqueues.sentForApproval.title',
      defaultMessage: 'Sent for encoding',
      description: 'Title of sent for approval workqueue'
    },
    query: {
      status: { type: 'exact', term: EventStatus.enum.DECLARED },
      flags: {
        noneOf: [InherentFlags.CORRECTION_REQUESTED]
      },
      updatedAtLocation: { type: 'within', location: user('primaryOfficeId') }
    },
    actions: [
      {
        type: 'DEFAULT'
      }
    ],
    columns: [
      DATE_OF_EVENT_COLUMN,
      {
        label: {
          defaultMessage: 'Sent for review',
          description: 'This is the label for the workqueue column',
          id: 'workqueue.in-review.column.sent-for-update'
        },
        value: event.field('updatedAt')
      }
    ]
  },
  {
    slug: 'in-review-all',
    icon: 'FileSearch',
    name: {
      id: 'workqueues.sentForApproval.title',
      defaultMessage: 'Ready for encoding',
      description: 'Title of sent for approval workqueue'
    },
    query: {
      type: 'or',
      clauses: [
        {
          status: {
            type: 'anyOf',
            terms: ['DECLARED']
          }
        },
        {
          flags: {
            anyOf: [InherentFlags.CORRECTION_REQUESTED, 'validated'],
            noneOf: [InherentFlags.REJECTED]
          }
        }
      ]
    },
    actions: [],
    columns: [
      DATE_OF_EVENT_COLUMN,
      {
        label: {
          defaultMessage: 'Sent for review',
          description: 'This is the label for the workqueue column',
          id: 'workqueue.in-review-all.column.sent-for-review'
        },
        value: event.field('updatedAt')
      }
    ]
  },
  {
    slug: 'requires-updates-self',
    icon: 'FileMinus',
    name: {
      id: 'workqueues.requiresUpdates.title',
      defaultMessage: 'Requires updates',
      description: 'Title of requires updates workqueue'
    },
    query: {
      status: { type: 'anyOf', terms: ['DECLARED', 'NOTIFIED'] },
      flags: {
        anyOf: [InherentFlags.REJECTED]
      },
      createdBy: { type: 'exact', term: user('id') }
    },
    actions: [
      {
        type: 'DEFAULT'
      }
    ],
    columns: [
      DATE_OF_EVENT_COLUMN,
      {
        label: {
          defaultMessage: 'Sent for update',
          description: 'This is the label for the workqueue column',
          id: 'workqueue.sent-for-update.column.sent-for-update'
        },
        value: event.field('updatedAt')
      }
    ]
  },
  {
    slug: 'requires-updates-office',
    icon: 'FileMinus',
    name: {
      id: 'workqueues.requiresUpdates.title',
      defaultMessage: 'Requires updates',
      description: 'Title of requires updates workqueue'
    },
    query: {
      flags: {
        anyOf: [InherentFlags.REJECTED]
      },
      updatedAtLocation: { type: 'within', location: user('primaryOfficeId') }
    },
    actions: [
      {
        type: 'DEFAULT'
      }
    ],
    columns: [
      DATE_OF_EVENT_COLUMN,
      {
        label: {
          defaultMessage: 'Sent for update',
          description: 'This is the label for the workqueue column',
          id: 'workqueue.sent-for-update.column.sent-for-update'
        },
        value: event.field('updatedAt')
      }
    ]
  },
  {
    slug: 'sent-for-approval',
    icon: 'FileText',
    name: {
      id: 'workqueues.sentForApproval.title',
      defaultMessage: 'Sent for encoding',
      description: 'Title of sent for approval workqueue'
    },
    query: {
      type: 'or',
      clauses: [
        {
          updatedBy: { type: 'exact', term: user('id') },
          flags: {
            noneOf: [InherentFlags.REJECTED],
            anyOf: ['validated']
          }
        },
        {
          flags: {
            anyOf: [InherentFlags.CORRECTION_REQUESTED]
          },
          updatedBy: { type: 'exact', term: user('id') }
        }
      ]
    },
    actions: [],
    columns: [
      DATE_OF_EVENT_COLUMN,
      {
        label: {
          defaultMessage: 'Sent for encoding',
          description: 'This is the label for the workqueue column',
          id: 'workqueue.sent-for-approval.column.sent-for-approval'
        },
        value: event.field('updatedAt')
      }
    ]
  },
  {
    slug: 'encoded',
    icon: 'FileText',
    name: {
      id: 'workqueues.sentForApproval.title',
      defaultMessage: 'Encoded',
      description: 'Title of sent for approval workqueue'
    },
    query: {
      flags: {
        noneOf: [InherentFlags.CORRECTION_REQUESTED],
        anyOf: ['pending-first-certificate-issuance']
      },
      status: { type: 'exact', term: 'REGISTERED' },
      updatedAtLocation: { type: 'within', location: user('primaryOfficeId') }
    },
    actions: [
      {
        type: 'PRINT_CERTIFICATE'
      }
    ],
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
  }
])
