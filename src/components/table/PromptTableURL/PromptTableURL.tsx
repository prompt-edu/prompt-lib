import { ReactElement } from 'react'
import { WithId } from '../PromptTable/PromptTableTypes'
import { PromptTable } from '../PromptTable/PromptTable'
import { useTableUrlState } from './urlParsing/useTableUrlState'
import { useSyncTableStateToUrl } from './urlParsing/useSyncTableStateToUrl'
import { PromptTableURLProps } from './PromptTableURLTypes'

export function PromptTableURL<T extends WithId>({
  sortingQueryParam,
  filteringQueryParam,
  onSortingChange,
  onSearchChange,
  onColumnFiltersChange,
  ...tableProps
}: PromptTableURLProps<T>): ReactElement {
  const sortingQueryParamEnabled = sortingQueryParam?.enabled ?? true
  const sortingQueryParamName = sortingQueryParam?.paramName ?? 'sorting'
  const filteringQueryParamEnabled = filteringQueryParam?.enabled ?? true
  const filteringQueryParamName = filteringQueryParam?.paramName ?? 'filters'
  const globalSearchQueryParamName = filteringQueryParam?.globalSearchParamName ?? 'search'

  const { sorting, setSorting, search, setSearch, columnFilters, setColumnFilters } =
    useTableUrlState({
      initialState: tableProps.initialState,
      filters: tableProps.filters,
      sortingQueryParamEnabled,
      sortingQueryParamName,
      filteringQueryParamEnabled,
      filteringQueryParamName,
      globalSearchQueryParamName,
    })

  useSyncTableStateToUrl({
    sorting,
    columnFilters,
    search,
    sortingQueryParamEnabled,
    sortingQueryParamName,
    filteringQueryParamEnabled,
    filteringQueryParamName,
    globalSearchQueryParamName,
  })

  return (
    <PromptTable
      {...tableProps}
      initialState={{
        ...tableProps.initialState,
        sorting,
        columnFilters,
        globalFilter: search,
      }}
      onSortingChange={(s) => {
        setSorting(s)
        onSortingChange?.(s)
      }}
      onSearchChange={(s) => {
        setSearch(s)
        onSearchChange?.(s)
      }}
      onColumnFiltersChange={(f) => {
        setColumnFilters(f)
        onColumnFiltersChange?.(f)
      }}
    />
  )
}
