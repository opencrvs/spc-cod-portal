import { differenceInDays } from 'date-fns'
import { ActionDocument, AddressFieldValue } from '@opencrvs/toolkit/events'
import { COUNTRY_NAMES_BY_CODE } from './countries'

function getCountryPlaceOfBirthResolved(
  declaration: ActionDocument['declaration']
) {
  const placeOfBirth =
    'child.birthLocation.privateHome' in declaration
      ? declaration['child.birthLocation.privateHome']
      : 'child.birthLocation.other' in declaration
        ? declaration['child.birthLocation.other']
        : null

  const maybeAddress = AddressFieldValue.safeParse(placeOfBirth)

  if (!maybeAddress.success) {
    return 'Farajaland'
  }

  const country = maybeAddress.data.country

  return COUNTRY_NAMES_BY_CODE[country] || 'Farajaland'
}

/**
 * Extract the disease label from the selected codes based on the UC code.
 *
 * The selectedCodes string can contain multiple codes per section, e.g.:
 *   "Ia: I509; S681; X599; M109; F439; E149; K088; R634/Ib: E669/Ic: R42"
 *
 * Each section (Ia, Ib, Ic, Id, Ie, II) maps to a cause letter (A, B, C, D, E, Other).
 * Within each section, multiple semicolon-separated codes map to symptom fields
 * (one, two, three, ... eight).
 *
 * Steps:
 * 1. Parse the selectedCodes into a flat list of entries with prefix and 1-based index.
 * 2. Find the entry whose code shares the longest prefix with ucCode.
 * 3. Map the entry to the corresponding declaration field path.
 * 4. Return the label from the declaration for that field, or 'None'.
 */
function extractDiseaseFromSelectedCodes(
  ucCode: string,
  selectedCodes: string,
  declaration: ActionDocument['declaration']
): string {
  if (!ucCode || !selectedCodes) {
    return 'None'
  }

  const symptomNumbers = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight'
  ]

  const prefixToLetter: Record<string, string> = {
    Ia: 'A',
    Ib: 'B',
    Ic: 'C',
    Id: 'D',
    Ie: 'E',
    II: 'Other'
  }

  // --- Parse selectedCodes into a list of { prefix, index, code } ---
  interface CodeEntry {
    prefix: string
    index: number
    code: string
  }

  const entries: CodeEntry[] = []
  const sections = selectedCodes.split('/')

  for (const section of sections) {
    const colonIndex = section.indexOf(':')
    if (colonIndex === -1) continue

    const prefix = section.slice(0, colonIndex).trim()
    const codesPart = section.slice(colonIndex + 1).trim()

    const codes = codesPart
      .split(';')
      .map((c) => c.trim())
      .filter(Boolean)

    codes.forEach((code, index) => {
      entries.push({ prefix, index: index + 1, code })
    })
  }

  // --- Find the best matching code entry for ucCode ---
  let bestEntry: CodeEntry | null = null
  let bestMatchLength = -1

  for (const entry of entries) {
    const candidate = entry.code
    let matchLength = 0
    const minLen = Math.min(ucCode.length, candidate.length)

    for (let i = 0; i < minLen; i++) {
      if (ucCode[i].toUpperCase() === candidate[i].toUpperCase()) {
        matchLength++
      } else {
        break
      }
    }

    if (matchLength > bestMatchLength) {
      bestMatchLength = matchLength
      bestEntry = entry
    }
  }

  if (!bestEntry) {
    return 'None'
  }

  // --- Map the best entry to a declaration field path ---
  const letter = prefixToLetter[bestEntry.prefix]
  if (!letter) {
    return 'None'
  }

  const symptomNumber = symptomNumbers[bestEntry.index - 1]
  if (!symptomNumber) {
    return 'None'
  }

  const fieldPath = `eventDetails.causeOfDeath${letter}.symptom.${symptomNumber}`

  const fieldValue = declaration?.[fieldPath as keyof typeof declaration]
  if (
    fieldValue &&
    typeof fieldValue === 'object' &&
    'label' in fieldValue &&
    fieldValue.label
  ) {
    return (fieldValue.label as string) || 'None'
  }

  return 'None'
}

export function precalculateDeathEvent(
  _action: ActionDocument,
  declaration: ActionDocument['declaration']
) {
  const ucCode = declaration['irisOutput.ucCode']
  const selectedCodes = declaration['irisOutput.selectedCodes']

  if (!ucCode || !selectedCodes) {
    return declaration
  }

  const ucCodeLabel = extractDiseaseFromSelectedCodes(
    ucCode as string,
    selectedCodes as string,
    declaration
  )

  return {
    ...declaration,
    'irisOutput.ucCodeLabel': ucCodeLabel
  }
}

export function precalculateBirthEvent(
  action: ActionDocument,
  declaration: ActionDocument['declaration']
) {
  const createdAt = new Date(action.createdAt)
  const childDoB = declaration['child.dob']
  if (!childDoB) return action

  return {
    ...declaration,
    'child.age.days': differenceInDays(createdAt, new Date(childDoB as string)),
    'child.countryPlaceOfBirth': getCountryPlaceOfBirthResolved(declaration)
  }
}
