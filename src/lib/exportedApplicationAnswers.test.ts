import { describe, expect, it } from 'vitest'
import {
  compareByOrder,
  getAnswerKey,
  getQuestionName,
  type RuntimeExportedApplicationAnswer,
} from './exportedApplicationAnswers'

const answer = (
  fields: Partial<RuntimeExportedApplicationAnswer>,
): RuntimeExportedApplicationAnswer => ({
  answer: 'Yes',
  type: 'text',
  ...fields,
})

describe('getQuestionName', () => {
  it('shows the title when core sends one', () => {
    expect(
      getQuestionName(answer({ title: 'English level', key: 'language_proficiency_english' }), 0),
    ).toBe('English level')
  })

  it('falls back to the access key for answers without a title', () => {
    expect(getQuestionName(answer({ key: 'language_proficiency_english' }), 0)).toBe(
      'language_proficiency_english',
    )
    expect(getQuestionName(answer({ title: '  ', key: 'motivation' }), 0)).toBe('motivation')
  })

  it('falls back to the position without a title or key', () => {
    expect(getQuestionName(answer({}), 2)).toBe('Question 3')
    expect(getQuestionName(answer({ key: ' ' }), 0)).toBe('Question 1')
  })
})

describe('getAnswerKey', () => {
  it('uses the question id', () => {
    expect(getAnswerKey(answer({ questionID: 'q-1', key: 'motivation' }), 4)).toBe('q-1')
  })

  it('falls back to the position for answers without an id', () => {
    expect(getAnswerKey(answer({ key: 'motivation' }), 4)).toBe('answer-4')
  })
})

describe('compareByOrder', () => {
  it('sorts by order_num or orderNum and puts answers without an order last', () => {
    const answers = [
      answer({ key: 'c' }),
      answer({ key: 'b', orderNum: 2 }),
      answer({ key: 'a', order_num: 1 }),
    ]
    expect([...answers].sort(compareByOrder).map((a) => a.key)).toEqual(['a', 'b', 'c'])
  })
})
