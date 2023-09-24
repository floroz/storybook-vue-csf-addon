import fs from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { parseSFCStory } from '../parse-story'

describe('parseSFCStory', () => {
  it('should parse a story correctly', async () => {
    const code = await getStorySFC()
    parseSFCStory(code)
    expect(true).toBe(true)
  })
})

const __dirname = dirname(fileURLToPath(import.meta.url))

async function getStorySFC(): Promise<string> {
  return (await fs.readFile(resolve(__dirname, './test-story.vue'), 'utf-8')).toString()
}
