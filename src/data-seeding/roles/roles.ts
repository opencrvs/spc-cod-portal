import { MessageDescriptor } from 'react-intl'
import { defineScopes, EncodedScope } from '@opencrvs/toolkit/scopes'

type Role = {
  id: string
  label: MessageDescriptor
  scopes: EncodedScope[]
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
      { type: 'organisation.read-locations' },
      { type: 'user.read', options: { accessLevel: 'location' } },
      { type: 'user.search', options: { accessLevel: 'administrativeArea' } },
      { type: 'record.print-certified-copies' },
      { type: 'performance.read-dashboards' },
      {
        type: 'workqueue',
        options: {
          ids: ['assigned-to-you', 'recent', 'requires-completion', 'requires-updates-office', 'in-review', 'encoded']
        }
      },
      {
        type: 'record.create',
        options: { event: ['death'], placeOfEvent: 'administrativeArea' }
      },
      { type: 'record.search', options: { event: ['death'] } },
      { type: 'record.read', options: { event: ['death'] } },
      { type: 'record.declare', options: { event: ['death'] } },
      { type: 'record.edit', options: { event: ['death'] } },
      { type: 'record.archive', options: { event: ['death'] } },
      { type: 'record.print-certified-copies', options: { event: ['death'] } },
      { type: 'record.request-correction', options: { event: ['death'] } },
      {
        type: 'dashboard.view',
        options: { ids: ['statistics'] }
      }
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
        { type: 'organisation.read-locations' },
        { type: 'user.create', options: { role: ['MR_OFFICER', 'CODING_OFFICER', 'NATIONAL_SYSTEM_ADMIN'] } },
        { type: 'user.edit', options: { role: ['MR_OFFICER', 'CODING_OFFICER', 'NATIONAL_SYSTEM_ADMIN'] } },
        { type: 'user.read' },
        { type: 'user.search', options: { accessLevel: 'administrativeArea' } },
        { type: 'performance.read' },
        { type: 'record.reindex' },
        { type: 'integration.create' },
        { type: 'performance.read-dashboards' },
        {
          type: 'dashboard.view',
          options: { ids: ['registrations', 'completeness', 'registry'] }
        }
      ])
    ]
  },
  {
    id: 'LOCAL_SYSTEM_ADMIN',
    label: {
      defaultMessage: 'Local System Admin',
      description: 'Name for user role Local System Admin',
      id: 'userRole.localSystemAdmin'
    },
    scopes: [
      ...defineScopes([
        { type: 'organisation.read-locations', options: { accessLevel: 'administrativeArea' } },
        { type: 'user.create', options: { accessLevel: 'administrativeArea', role: ['MR_OFFICER', 'CODING_OFFICER', 'NATIONAL_SYSTEM_ADMIN'] } },
        { type: 'user.edit', options: { accessLevel: 'administrativeArea', role: ['MR_OFFICER', 'CODING_OFFICER', 'NATIONAL_SYSTEM_ADMIN'] } },
        { type: 'user.read', options: { accessLevel: 'administrativeArea' } },
        { type: 'user.search', options: { accessLevel: 'administrativeArea' } }
      ])
    ]
  },
  {
    id: 'CODING_OFFICER', // Equivalent to NATIONAL_REGISTRAR
    label: {
      defaultMessage: 'Regional Coding Officer',
      description: 'Name for user role Regional Coding Officer',
      id: 'userRole.regionalCodingOfficer'
    },
    scopes: defineScopes([
      { type: 'performance.read' },
      { type: 'organisation.read-locations' },
      { type: 'performance.read-dashboards' },
      { type: 'user.read-only-my-audit' },
      { type: 'user.read' },
      { type: 'user.search', options: { accessLevel: 'administrativeArea' } },
      { type: 'record.search', options: { event: ['death'] } },
      {
        type: 'workqueue',
        options: {
          ids: ['assigned-to-you', 'recent', 'requires-updates-office', 'in-review-all', 'encoded']
        }
      },
      { type: 'record.create', options: { event: ['death'] } },
      { type: 'record.read', options: { event: ['death'] } },
      { type: 'record.declare', options: { event: ['death'] } },
      { type: 'record.edit', options: { event: ['death'] } },
      { type: 'record.reject', options: { event: ['death'] } },
      { type: 'record.archive', options: { event: ['death'] } },
      { type: 'record.review-duplicates', options: { event: ['death'] } },
      { type: 'record.register', options: { event: ['death'] } },
      { type: 'record.print-certified-copies', options: { event: ['death'] } },
      { type: 'record.correct', options: { event: ['death'] } },
      { type: 'record.unassign-others', options: { event: ['death'] } },
      {
        type: 'dashboard.view',
        options: { ids: ['uploader', 'export', 'statistics'] }
      }
    ])
  }
]
