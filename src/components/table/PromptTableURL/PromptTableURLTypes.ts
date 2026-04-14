import { TableProps } from '../PromptTable/PromptTableTypes'
import { WithId } from '../PromptTable/PromptTableTypes'

export interface UrlParamConfig {
  enabled?: boolean
  paramName?: string
}

export interface FilteringUrlParamConfig extends UrlParamConfig {
  globalSearchParamName?: string
}

export interface PromptTableURLProps<T extends WithId> extends TableProps<T> {
  sortingQueryParam?: UrlParamConfig
  filteringQueryParam?: FilteringUrlParamConfig
}
