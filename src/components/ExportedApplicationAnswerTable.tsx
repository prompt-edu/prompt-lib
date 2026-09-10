import { AlignLeft, CheckSquare } from 'lucide-react'
import { useMemo } from 'react'
import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components'

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

export const ExportedApplicationAnswerTable = ({
  applicationAnswers,
}: ExportedApplicationAnswerTableProps) => {
  const orderedAnswers = useMemo(
    () => [...(applicationAnswers ?? [])].sort(compareByOrder),
    [applicationAnswers],
  )

  return (
    <div className='overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-1/12'>Type</TableHead>
            <TableHead className='w-1/5'>Key</TableHead>
            <TableHead>Answer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderedAnswers.map((answer, index) => {
            return (
              <TableRow key={answer.key} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                <TableCell>
                  {answer.type === 'multiselect' ? (
                    <CheckSquare className='h-4 w-4 text-muted-foreground' />
                  ) : (
                    <AlignLeft className='h-4 w-4 text-muted-foreground' />
                  )}
                </TableCell>

                <TableCell className='font-medium'>
                  <div className='flex items-center space-x-2'>
                    <span>{answer.key}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {Array.isArray(answer.answer) ? (
                    <div>
                      {answer.answer.map((item, idx) => (
                        <Badge key={idx} className='mr-1'>
                          {item}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className='whitespace-pre-wrap break-words'>{answer.answer}</p>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
