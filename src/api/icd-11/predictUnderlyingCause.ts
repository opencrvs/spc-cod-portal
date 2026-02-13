/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'

const covid = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'covid.json'), 'utf8')
)

const sepsis = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'sepsis.json'), 'utf8')
)
function scoreEntity(entity: any): number {
  let score = 0
  const title = entity.title.toLowerCase()

  // Chapter signal (infectious diseases)
  if (entity.chapter === '25') score += 3

  // Penalize obvious non-causes
  const terminalKeywords = [
    'sepsis',
    'failure',
    'arrest',
    'shock',
    'history',
    'screening',
    'vaccine'
  ]

  if (terminalKeywords.some((k) => title.includes(k))) {
    score -= 4
  }

  // Coding notes are usually a warning sign
  if (entity.hasCodingNote) score -= 2

  // Leaf nodes are often specific diseases (good),
  // but not always sufficient on their own
  if (entity.isLeaf) score += 1

  return score
}

function summarizeCandidates(searchResponse: any) {
  return searchResponse.destinationEntities
    .map((e: any) => {
      const title = e.title ?? ''
      return {
        code: e.code ?? e.theCode ?? '—',
        title: title.length > 60 ? title.slice(0, 57) + '…' : title,
        chapter: e.chapter ?? '—',
        leaf: Boolean(e.isLeaf),
        note: Boolean(e.hasCodingNote),
        score: scoreEntity(e)
      }
    })
    .sort((a: any, b: any) => b.score - a.score)
}

console.log('COVID candidates:')
console.table(summarizeCandidates(covid).slice(0, 5))

console.log('\nSepsis candidates:')
console.table(summarizeCandidates(sepsis).slice(0, 5))
