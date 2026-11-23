// The provided-output DTO transfers `order_num` and sends multi-select answers as arrays,
// neither of which the declared `ExportedApplicationAnswer` describes. Core is moving from the
// free-text access key to the question id and title (prompt-edu/prompt#2348), so answers may
// carry the key, the id and title, or all of them.
export interface RuntimeExportedApplicationAnswer {
  questionID?: string
  title?: string
  key?: string
  answer: string | string[]
  type: 'text' | 'multiselect'
  orderNum?: number
  order_num?: number
}

const resolveOrder = (answer: RuntimeExportedApplicationAnswer) => {
  const order = answer.order_num ?? answer.orderNum
  return typeof order === 'number' && Number.isFinite(order) ? order : Number.POSITIVE_INFINITY
}

export const compareByOrder = (
  a: RuntimeExportedApplicationAnswer,
  b: RuntimeExportedApplicationAnswer,
) => {
  const left = resolveOrder(a)
  const right = resolveOrder(b)
  if (left === right) return 0
  return left < right ? -1 : 1
}

/** The question's title, else its access key, else its position in the list. */
export const getQuestionName = (answer: RuntimeExportedApplicationAnswer, index: number) =>
  answer.title?.trim() || answer.key?.trim() || `Question ${index + 1}`

/**
 * A stable list key: the question id where core sends it. Older answers only carry an access
 * key, which may repeat, so they fall back to the position in the static list.
 */
export const getAnswerKey = (answer: RuntimeExportedApplicationAnswer, index: number) =>
  answer.questionID || `answer-${index}`
