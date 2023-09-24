import {
  type SFCScriptBlock,
  compileScript,
  compileTemplate,
  parse,
  rewriteDefault,
} from 'vue/compiler-sfc'
import { format as prettierFormat } from 'prettier'
import { parseSFCStory } from '../parser'
import type { ParsedMeta, ParsedStory } from '../types'

/**
 * Transforms a Vue SFC to a Storybook's Component Story Format (CSF)
 * @param code The code in the Vue SFC
 * @returns The code in the Storybook CSF format
 */
export async function transform(code: string): Promise<string> {
  let result = ''
  const { descriptor } = parse(code)
  const { meta, stories } = parseSFCStory(code)
  const compiledScript = compileScript(descriptor, { id: 'test' })

  if (compiledScript) {
    result += rewriteDefault(compiledScript.content, '_sfc_main')
    result += '\n'
  }
  else {
    result += 'const _sfc_main = {}\n'
  }
  result += await transformTemplate({ meta, stories }, compiledScript)
  result = await organizeImports(result)
  return result
}

async function transformTemplate(
  {
    meta,
    stories,
  }: {
    meta: ParsedMeta
    stories: ParsedStory[]
  },
  resolvedScript?: SFCScriptBlock,
) {
  let result = generateDefaultImport(meta)
  for (const story of stories)
    result += generateStoryImport(story, resolvedScript)

  return result
}

function generateDefaultImport(
  { title, component }: ParsedMeta,
) {
  return `export default {
    ${title ? `title: '${title}',` : ''}
    ${component ? `component: ${component},` : ''}
  }
  `
}

function generateStoryImport(
  { id: storyId, title, template }: ParsedStory,
  resolvedScript?: SFCScriptBlock,
) {
  const { code } = compileTemplate({
    source: template.trim(),
    filename: 'test.vue',
    id: 'test',
    compilerOptions: {
      bindingMetadata: resolvedScript?.bindings,
      // prevent the hoisting of static variables since that would
      // result in clashing variable names when the same HTML Tags are used in multiple stories within the same `*.stories.vue` file.
      hoistStatic: false,
    },
  })

  // Capitalize id to avoid collisions with standard js keywords (e.g. if the id is 'default')
  storyId = storyId.charAt(0).toUpperCase() + storyId.slice(1)

  const renderFunction = code.replace(
    'export function render',
    `function render${storyId}`,
  )

  // Each named export is a story, has to return a Vue ComponentOptionsBase
  return `
    ${renderFunction}
    export const ${storyId} = () => Object.assign({render: render${storyId}}, _sfc_main)
    ${storyId}.storyName = '${title}'
    ${storyId}.parameters = {
      docs: { source: { code: \`${template.trim()}\` } },
    };`
}

async function organizeImports(result: string) {
  // Use prettier to organize imports
  return prettierFormat(result, {
    parser: 'babel',
    plugins: ['prettier-plugin-organize-imports'],
  })
}
