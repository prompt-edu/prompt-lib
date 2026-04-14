import { ColumnFiltersState, SortingState } from '@tanstack/react-table'
import { useEffect } from 'react'
import { serializeColumnFiltersForUrl, serializeSortingForUrl } from './urlParsing'

export function useSyncTableStateToUrl({
  sorting,
  columnFilters,
  search,
  sortingQueryParamEnabled,
  sortingQueryParamName,
  filteringQueryParamEnabled,
  filteringQueryParamName,
  globalSearchQueryParamName,
}: {
  sorting: SortingState
  columnFilters: ColumnFiltersState
  search: string
  sortingQueryParamEnabled: boolean
  sortingQueryParamName: string
  filteringQueryParamEnabled: boolean
  filteringQueryParamName: string
  globalSearchQueryParamName: string
}): void {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const url = new URL(window.location.href)

    if (sortingQueryParamEnabled) {
      const serializedSorting = serializeSortingForUrl(sorting)
      if (serializedSorting) {
        url.searchParams.set(sortingQueryParamName, serializedSorting)
      } else {
        url.searchParams.delete(sortingQueryParamName)
      }
    } else {
      url.searchParams.delete(sortingQueryParamName)
    }

    if (filteringQueryParamEnabled) {
      const serializedFilters = serializeColumnFiltersForUrl(columnFilters)
      if (serializedFilters) {
        url.searchParams.set(filteringQueryParamName, serializedFilters)
      } else {
        url.searchParams.delete(filteringQueryParamName)
      }

      if (search.length > 0) {
        url.searchParams.set(globalSearchQueryParamName, search)
      } else {
        url.searchParams.delete(globalSearchQueryParamName)
      }
    } else {
      url.searchParams.delete(filteringQueryParamName)
      url.searchParams.delete(globalSearchQueryParamName)
    }

    const nextUrl = `${url.pathname}${url.search}${url.hash}`
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`

    if (nextUrl !== currentUrl) {
      window.history.replaceState(window.history.state, '', nextUrl)
    }
  }, [
    sorting,
    columnFilters,
    search,
    sortingQueryParamEnabled,
    sortingQueryParamName,
    filteringQueryParamEnabled,
    filteringQueryParamName,
    globalSearchQueryParamName,
  ])
}
