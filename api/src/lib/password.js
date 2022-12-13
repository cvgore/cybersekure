export const serializePcr = ({
  pcrEnable,
  pcrMinLength,
  pcrSpecialChars,
  pcrLetters,
}) => {
  if (!pcrEnable) {
    return null
  }

  const serialized = []

  if (pcrMinLength > 0) {
    serialized.push(`ml=${pcrMinLength}`)
  }

  if (pcrSpecialChars) {
    serialized.push(`sn=1`)
  }

  if (pcrLetters) {
    serialized.push(`l=1`)
  }

  return serialized.join('|')
}

export const deserializePcr = (pcr) => {
  if (!pcr) {
    return {}
  }

  const parts = pcr.split('|')
  const data = {}

  for (const part of parts) {
    const [key, value] = part.split('=')

    switch (key) {
      case 'ml':
        data.pcrMinLength = parseInt(value)
        break
      case 'sn':
        data.pcrSpecialChars = value === '1'
        break
      case 'l':
        data.pcrLetters = value === '1'
        break
    }
  }

  return data
}

export const oneTimePassword = (usernameLength, knownSecret, given) => {
  return Math.abs(Math.round(knownSecret / Math.sin(usernameLength))) === given
}

export const ceasarCipher = (message) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const newalpha = 'nopqrstuvwxyzabcdefghijklm'.split('')

  return message
    .toLowerCase()
    .split('')
    .map((x) => newalpha[alphabet.indexOf(x)])
    .join('')
}

export const ceasarDecipher = (message) => {
  const alphabet = 'nopqrstuvwxyzabcdefghijklm'.split('')
  const newalpha = 'abcdefghijklmnopqrstuvwxyz'.split('')

  return message
    .toLowerCase()
    .split('')
    .map((x) => newalpha[alphabet.indexOf(x)])
    .join('')
}
