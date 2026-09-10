import type { ServerDrivenFeatures } from '../PromptTableTypes'

export type ResolvedServerDrivenFeatures = Required<ServerDrivenFeatures>

/**
 * Expands the `serverDriven` prop into one flag per concern. `true` is shorthand for every
 * concern, and anything the consumer leaves out stays client-side.
 */
export function resolveServerDriven(
  serverDriven: boolean | ServerDrivenFeatures = false,
): ResolvedServerDrivenFeatures {
  if (typeof serverDriven === 'boolean') {
    return { search: serverDriven, sorting: serverDriven, pagination: serverDriven }
  }

  return {
    search: serverDriven.search ?? false,
    sorting: serverDriven.sorting ?? false,
    pagination: serverDriven.pagination ?? false,
  }
}
