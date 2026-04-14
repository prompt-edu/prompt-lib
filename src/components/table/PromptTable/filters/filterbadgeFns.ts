import { TableFilter } from '../PromptTableTypes'

interface minMaxFilterType {
  noScore: boolean
  min?: string
  max?: string
}

export function displaySelectActiveFilterBadgeValue(filtervalue: unknown) {
  return `${filtervalue}`
}

export function displayMinMaxActiveFilterBadgeValue(filtervalue: unknown) {
  const v = filtervalue as minMaxFilterType
  const hasMin = v.min !== undefined && v.min !== ''
  const hasMax = v.max !== undefined && v.max !== ''
  if (v.noScore) {
    return 'None'
  }
  if (hasMin && hasMax) {
    return `${v.min} - ${v.max}`
  }
  if (hasMin) {
    return '≥ ' + v.min
  }
  if (hasMax) {
    return '≤ ' + v.max
  }
  return ''
}

export function tableFilterTypeDisplayFunction(tableFilter: TableFilter) {
  if (tableFilter.badge) {
    return tableFilter.badge.displayValue
  }
  if (tableFilter.type === 'numericRange') {
    return displayMinMaxActiveFilterBadgeValue
  }
  return displaySelectActiveFilterBadgeValue
}
