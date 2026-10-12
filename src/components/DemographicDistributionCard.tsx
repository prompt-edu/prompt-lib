import type { PassStatus } from '@tumaet/prompt-shared-state'
import { Bar, BarChart, type BarShapeProps, LabelList, Rectangle, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components'
import {
  type DemographicChartRow,
  type DemographicGroup,
  type DemographicStack,
  formatDemographicShare,
  getDemographicChartData,
  type StatisticsParticipation,
} from '@/lib/demographics'

interface DemographicDistributionCardProps {
  title: string
  description?: string
  groups: DemographicGroup<StatisticsParticipation>[]
  stackBy?: DemographicStack
  passStatusLabels?: Partial<Record<PassStatus, string>>
}

const TOP_RADIUS: [number, number, number, number] = [4, 4, 0, 0]

export const DemographicDistributionCard = ({
  title,
  description,
  groups,
  stackBy,
  passStatusLabels,
}: DemographicDistributionCardProps) => {
  const { segments, rows } = getDemographicChartData(groups, stackBy, passStatusLabels)
  const chartConfig: ChartConfig = Object.fromEntries(
    segments.map(({ key, label, color }) => [key, { label, color }]),
  )
  const lastSegmentKey = segments.at(-1)?.key

  return (
    <Card className='flex flex-col w-full h-full'>
      <CardHeader className='items-center'>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className='flex-1 flex flex-col justify-end pb-0'>
        <ChartContainer config={chartConfig} className='mx-auto w-full h-[280px]'>
          <BarChart data={rows} margin={{ top: 30, right: 10, bottom: 0, left: 10 }}>
            <XAxis
              dataKey='shortLabel'
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              interval={0}
              height={50}
            />
            <YAxis hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const row: DemographicChartRow | undefined = payload[0]?.payload
                    return row && `${row.label}: ${row.total} (${formatDemographicShare(row)})`
                  }}
                />
              }
            />
            {segments.length > 1 && (
              <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
            )}
            {segments.map((segment) => (
              <Bar
                key={segment.key}
                dataKey={segment.key}
                stackId='demographics'
                fill={segment.color}
                shape={({ x, y, width, height, payload }: BarShapeProps) => (
                  <Rectangle
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={segment.color}
                    radius={payload?.topSegment === segment.key ? TOP_RADIUS : 0}
                  />
                )}
              >
                {segment.key === lastSegmentKey && (
                  <LabelList
                    dataKey='total'
                    position='top'
                    offset={10}
                    className='fill-foreground'
                    fontSize={12}
                  />
                )}
              </Bar>
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
