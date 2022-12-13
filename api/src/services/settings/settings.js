import { ServiceValidationError, validateWith } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import { ceasarCipher, ceasarDecipher } from 'src/lib/password'

export const settings = () => {
  return db.setting.findMany()
}

export const setting = ({ key }) => {
  return db.setting.findUnique({ where: { key } })
}

export const updateSetting = ({ key, input }) => {
  return db.setting.update({
    data: input,
    where: { key },
  })
}

export const activateApplication = async ({ input }) => {
  const value = ceasarDecipher(input)

  validateWith(() => {
    if (value !== 'testkey') {
      console.log('valid key', { key: ceasarCipher('testkey') })
      throw new ServiceValidationError('Invalid activation key')
    }
  })

  await db.setting.update({
    data: {
      value,
    },
    where: { key: 'activationKey' },
  })

  return true
}
