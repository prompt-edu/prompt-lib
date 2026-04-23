import type { ReactNode } from 'react'
import { LockIcon } from 'lucide-react'
import { ScoreLevel } from '@tumaet/prompt-shared-state'

import { cn } from '@/lib/utils'

import { getLevelConfig } from './getLevelConfig'

export interface ScoreLevelSelectorProps {
  selectedScore?: ScoreLevel
  onScoreChange: (value: ScoreLevel) => void
  completed: boolean
  descriptionsByLevel: Record<ScoreLevel, string>
  labelsByLevel?: Partial<Record<ScoreLevel, string>>
  showIndicators?: boolean
  indicators?: Partial<Record<ScoreLevel, ReactNode[]>>
  hideUnselectedOnDesktop?: boolean
  className?: string
}

const scoreLevels = Object.values(ScoreLevel) as ScoreLevel[]

export const ScoreLevelSelector = ({
  selectedScore,
  onScoreChange,
  completed,
  descriptionsByLevel,
  labelsByLevel,
  showIndicators = true,
  indicators,
  hideUnselectedOnDesktop = true,
  className,
}: ScoreLevelSelectorProps) => {
  const hasIndicators =
    showIndicators && scoreLevels.some((level) => (indicators?.[level] ?? []).length > 0)

  return (
    <div className={className}>
      {scoreLevels.map((level) => {
        const config = getLevelConfig(level)
        const isSelected = selectedScore === level
        const descriptionID = `score-level-${level}-description`
        const label = labelsByLevel?.[level] ?? config.title
        const levelIndicators = showIndicators ? (indicators?.[level] ?? []) : []

        return (
          <div
            key={level}
            className={cn(
              'relative',
              hideUnselectedOnDesktop && selectedScore !== undefined && !isSelected && 'lg:hidden',
            )}
          >
            {levelIndicators.length > 0 && (
              <div className='absolute -top-6 left-0 z-10 w-full'>
                <div className='flex items-center justify-center gap-2 text-left'>
                  {levelIndicators.map((indicator, index) => (
                    <span key={`${level}-indicator-${index}`} className='flex items-center'>
                      {indicator}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              type='button'
              onClick={() => onScoreChange(level)}
              disabled={completed}
              aria-pressed={isSelected}
              aria-disabled={completed}
              aria-label={`Select ${label} score level`}
              aria-describedby={descriptionID}
              className={cn(
                'flex h-full w-full flex-col justify-start rounded-lg border-2 p-3 text-left text-sm transition-all',
                !isSelected && 'hover:bg-gray-100 dark:hover:bg-gray-800',
                isSelected
                  ? cn(config.textColor, config.selectedBg)
                  : 'bg-gray-50 dark:bg-gray-900',
                !completed && 'focus:ring-2 focus:ring-gray-400 focus:ring-offset-2',
                completed && 'cursor-not-allowed opacity-80',
                hasIndicators && 'mt-2',
                !selectedScore && config.border,
              )}
            >
              <div className='mb-1 flex justify-between'>
                <span className='font-semibold'>{label}</span>

                {completed && isSelected && (
                  <span className='flex items-center gap-1'>
                    <LockIcon
                      className={cn(
                        'h-4 w-4 text-muted-foreground',
                        isSelected && 'dark:text-gray-200',
                      )}
                    />
                  </span>
                )}
              </div>

              <p
                id={descriptionID}
                className={cn(
                  'line-clamp-3 text-muted-foreground',
                  isSelected && 'dark:text-gray-200',
                )}
              >
                {descriptionsByLevel[level]}
              </p>
            </button>
          </div>
        )
      })}
    </div>
  )
}
