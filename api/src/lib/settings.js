import { setting as service_getSetting } from 'src/services/settings/settings'

const setting = async (key) =>
  JSON.parse((await service_getSetting({ key })).value)

export const saveUserActivites = async () =>
  (await setting('saveUserActivities')) === true

export const maxFailedLoginAttempts = async () =>
  parseInt(await setting('maxFailedLoginAttempts'))

export const failedLoginLockoutTime = async () =>
  parseInt(await setting('failedLoginLockoutTime'))

export const sessionTime = async () => parseInt(await setting('sessionTime'))
