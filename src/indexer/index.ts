import fs from 'node:fs'
import type { IndexInput, IndexerOptions } from '@storybook/types'
import { parseSFCStory } from '../parser'
import { logger } from '../logger'

export async function index(
  fileName: string,
  { makeTitle }: IndexerOptions,
): Promise<IndexInput[]> {
  const code = fs.readFileSync(fileName, { encoding: 'utf-8' }).toString()

  const { meta, stories } = parseSFCStory(code)

  const inputs: IndexInput[] = []

  for (const story of stories) {
    const input: IndexInput = {
      type: 'story',
      importPath: fileName,
      exportName: story.title,
      title: makeTitle(meta.title),
    }

    inputs.push(input)

    logger.log('Indexed: ', input)
  }

  return inputs
}
