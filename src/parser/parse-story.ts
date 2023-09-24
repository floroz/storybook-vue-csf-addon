import type { SFCDescriptor } from 'vue/compiler-sfc'
import {
  compileScript,
  compileTemplate as compileTemplateSFC,
  parse,
} from 'vue/compiler-sfc'
import type { CallExpression, ObjectExpression, Statement } from '@babel/types'
import type { ElementNode } from '@vue/compiler-core'
import { sanitize } from '@storybook/csf'
import type { ConcreteComponent } from 'vue'
import type { ParsedMeta, ParsedStory } from '../types'

export function parseSFCStory(code: string) {
  const { descriptor } = parse(code)
  const meta = compileMeta(descriptor)
  const stories = compileStories(descriptor)
  return {
    meta,
    stories,
  }
}

function compileStories(descriptor: SFCDescriptor): ParsedStory[] {
  const template = compileTemplateSFC({
    source: descriptor.template?.content || '',
    filename: 'test.vue',
    id: 'test',
  })

  if (!template.ast)
    throw new Error('No AST found in the template. Template might be empty')

  if (template.ast.children.some(node => node.type !== 1 || node.tag !== 'Story'))
    throw new Error('Only `Story` root elements are supported in the template')

  const storyRoots = template.ast.children.filter(node => node.type === 1 && node.tag === 'Story')

  if (storyRoots.length === 0)
    throw new Error('No `Story` root element found in the template')

  const stories = []

  for (const storyNode of storyRoots) {
    if (storyNode.type !== 1 || storyNode.tag !== 'Story')
      continue

    const title = extractTitleFromStoryComponent(storyNode)

    if (!title)
      throw new Error('Story title is required')

    const id = sanitize(title).replace(/[^a-zA-Z0-9]/g, '_')

    const args = extractArgsFromStoryComponent(storyNode)

    const template = descriptor.template!.content

    stories.push({
      id,
      title,
      args,
      template,
    })
  }

  return stories
}

function extractTitleFromStoryComponent(node: ElementNode) {
  const prop = extractPropFromStoryComponent(node, 'title')
  if (prop && prop.type === 6)
    return prop.value?.content
}

function extractArgsFromStoryComponent(node: ElementNode): Record<string, unknown> {
  const prop = extractPropFromStoryComponent(node, 'args')
  // TODO: handle nested objects
  return {}
}

function extractPropFromStoryComponent(node: ElementNode, name: string) {
  if (node.type === 1) {
    return node.props.find(
      prop =>
        prop.name === name
        || (prop.name === 'bind'
          && prop.type === 7
          && prop.arg?.type === 4
          && prop.arg?.content === name),
    )
  }
}

function compileMeta(descriptor: SFCDescriptor): ParsedMeta {
  const script = compileScript(descriptor, { id: 'test' })

  if (!script.setup)
    throw new Error('Script Setup is required and the only syntax currently supported')

  if (script.scriptAst)
    throw new Error('Script Setup is required and the only syntax currently supported. Normal `<script>` blocks are forbidden')

  if (!script.scriptSetupAst)
    throw new Error('No content in script setup. You must declare the `defineMeta` function in the script setup')

  const defineMetaNode = getDefineMetaNode(script.scriptSetupAst)

  if (!defineMetaNode)
    throw new Error('The `defineMeta` function must be called in the script setup')

  const argumentsNode = defineMetaNode.arguments[0] as ObjectExpression

  // get title
  const title = extractTitleFromNodeArguments(argumentsNode)
  if (!title)
    throw new Error('The `defineMeta` function must be called with an object with a `title` property')

  // get args
  const args = {
    ...extractArgsFromNodeArguments(argumentsNode),
  }

  // get arg types
  const meta: ParsedMeta = {
    title,
    args,
    component: ('Button' as unknown) as ConcreteComponent, // TODO: get component name from defineMeta
  }

  return meta
}

/**
 *  Gets the call expression node for the `defineMeta` function
 * @param nodes list of nodes from the AST
 * @returns the call expression node for the `defineMeta` function
 */
function getDefineMetaNode(nodes: Statement[]): CallExpression | undefined {
  for (const node of nodes) {
    if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression' && 'name' in node.expression.callee && node.expression.callee.name === 'defineMeta') {
      const metaArguments = node.expression.arguments[0]

      if (!metaArguments)
        throw new Error('The `defineMeta` function must be called with an object as its first argument')

      if (metaArguments.type !== 'ObjectExpression')
        throw new Error('The `defineMeta` function must be called with an object as its first argument')

      return node.expression
    }
  }
}

function extractTitleFromNodeArguments(argumentsNode: ObjectExpression): string | undefined {
  let title: string | undefined

  for (const property of argumentsNode.properties) {
    if (property.type === 'ObjectProperty' && 'name' in property.key && property.key.name === 'title' && property.value.type === 'StringLiteral')
      title = property.value.value
  }

  return title
}

// FIXME: this is not implemented yet
function extractArgsFromNodeArguments(argumentsNode: ObjectExpression): Record<string, unknown> {
  const args = {}

  for (const property of argumentsNode.properties) {
    if (property.type === 'ObjectProperty' && 'name' in property.key && property.key.name !== 'title') {
      // TODO: handle nested objects
    }
  }

  return args
}
