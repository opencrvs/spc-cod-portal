import {
  ActionStatus,
  ActionType,
  EventStatus,
  InherentFlags,
  defineWorkqueues,
  event,
  user
} from '@opencrvs/toolkit/events'

// Example of a column that is used in the workqueue config
// eslint-disable-next-line no-unused-vars
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
    action: { type: ActionType.READ }
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
    action: { type: ActionType.READ }
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
    action: { type: ActionType.READ },
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
    query: { assignedTo: { type: 'exact', term: user('id') } },
    action: { type: ActionType.READ }
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
    action: { type: ActionType.READ },
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
    action: { type: ActionType.READ },
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
    action: { type: ActionType.READ },
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
          },
          flags: {
            noneOf: [InherentFlags.REJECTED]
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
    action: { type: ActionType.READ },
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
    icon: 'FileX',
    name: {
      id: 'workqueues.requiresUpdates.title',
      defaultMessage: 'Rejected',
      description: 'Title of requires updates workqueue'
    },
    query: {
      status: { type: 'anyOf', terms: ['DECLARED', 'NOTIFIED'] },
      flags: {
        anyOf: [`${ActionType.REGISTER}:${ActionStatus.Rejected}`.toLowerCase()]
      },
      createdBy: { type: 'exact', term: user('id') }
    },
    action: { type: ActionType.READ },
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
    icon: 'FileX',
    name: {
      id: 'workqueues.requiresUpdates.title',
      defaultMessage: 'Rejected',
      description: 'Title of requires updates workqueue'
    },
    query: {
      type: 'or',
      clauses: [
        {
          status: { type: 'anyOf', terms: ['DECLARED'] },
          flags: {
            anyOf: [InherentFlags.REJECTED]
          },
          updatedAtLocation: {
            type: 'within',
            location: user('primaryOfficeId')
          }
        },
        {
          status: { type: 'anyOf', terms: ['DECLARED'] },
          flags: {
            anyOf: [InherentFlags.REJECTED]
          },
          createdAtLocation: {
            type: 'within',
            location: user('primaryOfficeId')
          }
        }
      ]
    },
    action: { type: ActionType.READ },
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
    icon: 'Handshake',
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
    action: { type: ActionType.READ },
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
    icon: 'FilePlus',
    name: {
      id: 'workqueues.sentForApproval.title',
      defaultMessage: 'Encoded',
      description: 'Title of sent for approval workqueue'
    },
    query: {
      type: 'or',
      clauses: [
        {
          status: { type: 'anyOf', terms: ['REGISTERED'] },
          updatedAtLocation: {
            type: 'within',
            location: user('primaryOfficeId')
          }
        },
        {
          status: { type: 'anyOf', terms: ['REGISTERED'] },
          createdAtLocation: {
            type: 'within',
            location: user('primaryOfficeId')
          }
        }
      ]
    },
    action: { type: ActionType.READ },
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
