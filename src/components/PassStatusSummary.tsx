import type { PassStatus } from '@tumaet/prompt-shared-state'
import { Pie, PieChart } from 'recharts'
import { type ChartConfig, ChartContainer } from '@/components'
import { getPassStatusCounts, type StatisticsParticipation } from '@/lib/demographics'
import { cn } from '@/lib/utils'

interface PassStatusSummaryProps {
  participations: Pick<StatisticsParticipation, 'passStatus'>[]
  passStatusLabels?: Partial<Record<PassStatus, string>>
  size?: number
  className?: string
}

const EMPTY_RING = [{ key: 'empty', count: 1, fill: 'hsl(var(--muted))' }]

export const PassStatusSummary = ({
  participations,
  passStatusLabels,
  size = 64,
  className,
}: PassStatusSummaryProps) => {
  const counts = getPassStatusCounts(participations, passStatusLabels)
  const total = participations.length
  const chartConfig: ChartConfig = Object.fromEntries(
    counts.map(({ key, label, color }) => [key, { label, color }]),
  )
  const description = `${total} participants: ${counts
    .map(({ label, count }) => `${count} ${label.toLowerCase()}`)
    .join(', ')}`

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className='relative shrink-0' style={{ width: size, height: size }}>
        <ChartContainer config={chartConfig} className='aspect-square h-full w-full'>
          <PieChart title='Participants by status' desc={description}>
            <Pie
              data={total > 0 ? counts.map((c) => ({ ...c, fill: c.color })) : EMPTY_RING}
              dataKey='count'
              nameKey='key'
              innerRadius='65%'
              outerRadius='100%'
              strokeWidth={2}
              isAnimationActive={false}
            />
          </PieChart>
        </ChartContainer>
        <span
          className={cn(
            'absolute inset-0 flex items-center justify-center font-bold tabular-nums',
            size >= 120 ? 'text-3xl' : 'text-sm',
          )}
        >
          {total}
        </span>
      </div>
      <dl className='flex flex-wrap gap-x-4 gap-y-1 text-sm'>
        {counts.map(({ key, label, color, count }) => (
          <div key={key} className='flex items-center gap-1.5'>
            <span
              className='h-2.5 w-2.5 shrink-0 rounded-full'
              style={{ backgroundColor: color }}
              aria-hidden
            />
            <dt className='text-muted-foreground'>{label}</dt>
            <dd className='font-semibold tabular-nums'>{count}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
