import { ColumnDef } from '@tanstack/react-table'

function humanize(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .replace(/^./, (c) => c.toUpperCase())
}

export function generateColumns<T extends object>(data: T[]): ColumnDef<T>[] {
  if (!data.length) return []

  return Object.keys(data[0] as object).map((key) => ({
    accessorKey: key,
    header: humanize(key),
    cell: (info) => {
      const value = info.getValue()
      return typeof value === 'object' ? JSON.stringify(value) : String(value)
    },
  }))
}
