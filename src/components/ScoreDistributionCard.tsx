import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components'
import { formatScore, getScoreSummary } from '@/lib/scoreStatistics'

interface ScoreDistributionCardProps {
  scores: number[]
  title?: string
}

const chartConfig = {
  count: { label: 'Participants', color: 'hsl(var(--primary))' },
} satisfies ChartConfig

export const ScoreDistributionCard = ({
  scores,
  title = 'Score Distribution',
}: ScoreDistributionCardProps) => {
  const summary = getScoreSummary(scores)

  return (
    <Card className='flex flex-col w-full h-full'>
      <CardHeader className='items-center'>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {summary
            ? `${summary.count} scores · average ${formatScore(summary.average)} · median ${formatScore(summary.median)}`
            : 'No scores yet'}
        </CardDescription>
      </CardHeader>
      {summary && (
        <CardContent className='flex-1 flex flex-col justify-end pb-0'>
          <ChartContainer config={chartConfig} className='mx-auto w-full h-[280px]'>
            <BarChart data={summary.bins} margin={{ top: 30, right: 10, bottom: 0, left: 10 }}>
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
                  <ChartTooltipContent labelFormatter={(_, payload) => payload[0]?.payload.label} />
                }
              />
              <Bar dataKey='count' fill='var(--color-count)' radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey='count'
                  position='top'
                  offset={10}
                  className='fill-foreground'
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  )
}
