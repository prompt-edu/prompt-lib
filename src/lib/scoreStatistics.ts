export interface ScoreBin {
  shortLabel: string
  label: string
  count: number
}

export interface ScoreSummary {
  count: number
  average: number
  median: number
  bins: ScoreBin[]
}

const MAX_DISTINCT_BARS = 12
const TARGET_BIN_COUNT = 10

export const formatScore = (value: number) => String(Math.round(value * 100) / 100)

const getBinWidth = (range: number) => {
  const rough = range / TARGET_BIN_COUNT
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const factor = [1, 2, 5].find((f) => f * magnitude >= rough) ?? 10
  return factor * magnitude
}

const getBins = (sorted: number[]): ScoreBin[] => {
  const min = sorted[0]
  const max = sorted[sorted.length - 1]
  const distinct = [...new Set(sorted)]
  // A small scale (1-5, grades) reads best as one bar per value; a wide one (0-100) needs ranges.
  if (distinct.length <= MAX_DISTINCT_BARS && max - min <= MAX_DISTINCT_BARS) {
    return distinct.map((value) => ({
      shortLabel: formatScore(value),
      label: formatScore(value),
      count: sorted.filter((score) => score === value).length,
    }))
  }

  const width = getBinWidth(max - min)
  const start = Math.floor(min / width) * width
  const bins = Array.from({ length: Math.ceil((max - start) / width) }, (_, index) => {
    const from = start + index * width
    return {
      shortLabel: formatScore(from),
      label: `${formatScore(from)} to ${formatScore(from + width)}`,
      count: 0,
    }
  })
  for (const score of sorted) {
    // The last bin includes its upper bound, so the maximum does not open a bin of its own.
    const index = Math.min(Math.floor((score - start) / width), bins.length - 1)
    bins[Math.max(index, 0)].count++
  }
  return bins
}

export function getScoreSummary(scores: number[]): ScoreSummary | undefined {
  const sorted = scores.filter(Number.isFinite).sort((a, b) => a - b)
  if (sorted.length === 0) return undefined

  const middle = Math.floor(sorted.length / 2)
  return {
    count: sorted.length,
    average: sorted.reduce((sum, score) => sum + score, 0) / sorted.length,
    median: sorted.length % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2,
    bins: getBins(sorted),
  }
}
