import type { PassStatus } from '@tumaet/prompt-shared-state'

export function getStatusString(status: PassStatus): string {
  switch (status) {
    case 'passed':
      return 'Passed'
    case 'failed':
      return 'Failed'
    case 'not_assessed':
      return 'Not Assessed'
    default:
      return 'Unknown'
  }
}
