import { AlignLeft, CheckSquare } from 'lucide-react'
import { type ReactNode, useMemo } from 'react'
import { Badge, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components'

// The provided-output DTO transfers `order_num` and sends multi-select answers as arrays,
// neither of which the declared `ExportedApplicationAnswer` describes.
interface RuntimeExportedApplicationAnswer {
  key: string
  answer: string | string[]
  type: 'text' | 'multiselect'
  orderNum?: number
  order_num?: number
}

interface ExportedApplicationAnswerTableProps {
  applicationAnswers: RuntimeExportedApplicationAnswer[]
}

const resolveOrder = (answer: RuntimeExportedApplicationAnswer) => {
  const order = answer.order_num ?? answer.orderNum
  return typeof order === 'number' && Number.isFinite(order) ? order : Number.POSITIVE_INFINITY
}

const compareByOrder = (
  a: RuntimeExportedApplicationAnswer,
  b: RuntimeExportedApplicationAnswer,
) => {
  const left = resolveOrder(a)
  const right = resolveOrder(b)
  if (left === right) return 0
  return left < right ? -1 : 1
}

const AnswerBlock = ({ isEmpty, children }: { isEmpty: boolean; children: ReactNode }) => {
  if (isEmpty) {
    return (
      <div className='rounded-md border border-dashed border-border px-3 py-2.5 text-sm italic text-muted-foreground'>
        Not answered
      </div>
    )
  }

  return (
    <div className='rounded-md border-l-2 border-primary/40 bg-muted/50 px-3 py-2.5 text-sm'>
      {children}
    </div>
  )
}

export const ExportedApplicationAnswerTable = ({
  applicationAnswers,
}: ExportedApplicationAnswerTableProps) => {
  const orderedAnswers = useMemo(
    () => [...(applicationAnswers ?? [])].sort(compareByOrder),
    [applicationAnswers],
  )

  if (orderedAnswers.length === 0) {
    return null
  }

  return (
    <TooltipProvider>
      {/* biome-ignore lint/a11y/noRedundantRoles: Safari drops list semantics from a list-style-none list */}
      <ol role='list' className='m-0 list-none divide-y divide-border p-0'>
        {orderedAnswers.map((answer, index) => {
          const isMultiSelect = answer.type === 'multiselect'
          const Icon = isMultiSelect ? CheckSquare : AlignLeft
          const label = isMultiSelect ? 'Multi-select' : 'Text'
          const questionName = answer.key.trim() || `Question ${index + 1}`

          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: the DTO carries no question id, access keys may repeat, and the list is static and presentational
            <li key={index} className='flex gap-3 py-5 first:pt-0 last:pb-0'>
              <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground'>
                {index + 1}
              </div>

              <div className='min-w-0 flex-1 space-y-2.5'>
                <div className='flex items-center gap-2'>
                  <Tooltip>
                    <TooltipTrigger
                      type='button'
                      aria-label={`${label} question`}
                      className='inline-flex shrink-0 items-center border-0 bg-transparent p-0 text-muted-foreground'
                    >
                      <Icon className='h-4 w-4' aria-hidden='true' />
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                  </Tooltip>
                  <span className='min-w-0 break-words font-semibold'>{questionName}</span>
                </div>

                {Array.isArray(answer.answer) ? (
                  <AnswerBlock isEmpty={answer.answer.length === 0}>
                    <div className='flex flex-wrap gap-1.5'>
                      {answer.answer.map((option, optionIndex) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: multi-select values are not guaranteed unique and the list is static
                        <Badge key={optionIndex} className='max-w-full break-words'>
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </AnswerBlock>
                ) : (
                  <AnswerBlock isEmpty={!answer.answer.trim()}>
                    <p className='whitespace-pre-wrap break-words'>{answer.answer}</p>
                  </AnswerBlock>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </TooltipProvider>
  )
}
