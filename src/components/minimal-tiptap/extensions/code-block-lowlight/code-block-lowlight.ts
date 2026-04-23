import { CodeBlockLowlight as TiptapCodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'

export const CodeBlockLowlight = TiptapCodeBlockLowlight.extend({
  addOptions() {
    const parentOptions = this.parent?.()

    return {
      ...parentOptions,
      languageClassPrefix: parentOptions?.languageClassPrefix ?? 'language-',
      exitOnTripleEnter: parentOptions?.exitOnTripleEnter ?? true,
      exitOnArrowDown: parentOptions?.exitOnArrowDown ?? true,
      lowlight: createLowlight(common),
      defaultLanguage: null,
      enableTabIndentation: parentOptions?.enableTabIndentation ?? false,
      tabSize: parentOptions?.tabSize ?? 4,
      HTMLAttributes: {
        ...(parentOptions?.HTMLAttributes ?? {}),
        class: 'block-node',
      },
    }
  },
})

export default CodeBlockLowlight
