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
 * Steps:
 * 1. Parse selectedCodes string (e.g. "Ia: J969/Ib: I2199/Ic: I469")
 *    into a map of { Ia: "J969", Ib: "I2199", Ic: "I469" }.
 * 2. Find the best matching prefix key for ucCode by comparing characters.
 * 3. Map the key (Ia, Ib, etc.) to the corresponding declaration field path.
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

  const mapping: Record<string, string> = {
    Ia: 'eventDetails.causeOfDeathA.symptom.one',
    Ib: 'eventDetails.causeOfDeathB.symptom.one',
    Ic: 'eventDetails.causeOfDeathC.symptom.one',
    Id: 'eventDetails.causeOfDeathD.symptom.one',
    Ie: 'eventDetails.causeOfDeathE.symptom.one',
    II: 'eventDetails.causeOfDeathOther.symptom.one'
  }

  const codeMap: Record<string, string> = {}
  const parts = selectedCodes.split('/')
  for (const part of parts) {
    const [key, value] = part.split(':').map((s) => s.trim())
    if (key && value) {
      codeMap[key] = value
    }
  }

  let bestMatchKey: string | null = null
  let bestMatchLength = -1

  for (const key of Object.keys(codeMap)) {
    const candidate = codeMap[key]
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
      bestMatchKey = key
    }
  }

  if (!bestMatchKey) {
    return 'None'
  }

  const fieldPath = mapping[bestMatchKey]
  if (!fieldPath) {
    return 'None'
  }

  const fieldValue = declaration?.[fieldPath as keyof typeof declaration]
  if (
    fieldValue &&
    typeof fieldValue === 'object' &&
    'label' in fieldValue &&
    fieldValue.label
  ) {
    return fieldValue.label as string
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
