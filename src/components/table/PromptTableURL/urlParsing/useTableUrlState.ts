import { ColumnFiltersState, InitialTableState, SortingState } from '@tanstack/react-table'
import { useState } from 'react'
import { TableFilter } from '../../PromptTable/PromptTableTypes'
import { parseColumnFiltersFromUrl, parseSearchFromUrl, parseSortingFromUrl } from './urlParsing'

export function useTableUrlState({
  initialState,
  filters,
  sortingQueryParamEnabled,
  sortingQueryParamName,
  filteringQueryParamEnabled,
  filteringQueryParamName,
  globalSearchQueryParamName,
}: {
  initialState?: InitialTableState
  filters?: TableFilter[]
  sortingQueryParamEnabled: boolean
  sortingQueryParamName: string
  filteringQueryParamEnabled: boolean
  filteringQueryParamName: string
  globalSearchQueryParamName: string
}) {
  const [sorting, setSorting] = useState<SortingState>(() => {
    if (!sortingQueryParamEnabled || typeof window === 'undefined') {
      return initialState?.sorting ?? []
    }

    const urlSorting = parseSortingFromUrl(window.location.search, sortingQueryParamName)
    return urlSorting.length > 0 ? urlSorting : (initialState?.sorting ?? [])
  })

  const [search, setSearch] = useState<string>(() => {
    const initialSearchValue =
      typeof initialState?.globalFilter === 'string' ? initialState.globalFilter : ''

    if (!filteringQueryParamEnabled || typeof window === 'undefined') {
      return initialSearchValue
    }

    return (
      parseSearchFromUrl(window.location.search, globalSearchQueryParamName) ?? initialSearchValue
    )
  })

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    const initialColumnFilters = initialState?.columnFilters ?? []

    if (!filteringQueryParamEnabled || typeof window === 'undefined') {
      return initialColumnFilters
    }

    const urlFilters = parseColumnFiltersFromUrl(
      window.location.search,
      filteringQueryParamName,
      filters,
    )
    return urlFilters.length > 0 ? urlFilters : initialColumnFilters
  })

  return { sorting, setSorting, search, setSearch, columnFilters, setColumnFilters }
}
