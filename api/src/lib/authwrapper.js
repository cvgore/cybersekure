import fetch from 'node-fetch'

import { DbAuthHandler } from '@redwoodjs/api'

import { recordActivity } from './faktory'
import { oneTimePassword } from './password'
import {
  failedLoginLockoutTime,
  maxFailedLoginAttempts,
  sessionTime,
} from './settings'

const failedLoginsCounter = new Map()
const loginLocks = new Map()

export default class DbAuthHandlerCustom extends DbAuthHandler {
  _custom = {
    previousHandlers: {},
  }

  static get VERBS() {
    return {
      ...super.VERBS(),
      getOtp: 'GET',
      otp: 'POST',
    }
  }

  static get METHODS() {
    return [...super.METHODS(), 'getOtp', 'otp']
  }

  constructor(event, ctx, options) {
    super(event, ctx, options)

    this._custom.previousHandlers.login = this.options.login.handler.bind(this)

    this.options.login.handler = (dbUser) =>
      Promise.all([
        this._custom.previousHandlers.login(dbUser),
        this._afterUserValidation(dbUser),
      ]).then((x) => x[1])
  }

  async _handleOtp(user) {
    const otpSecret = this.params.otpSecret
    const otp = this.params.otp

    console.log(
      otpSecret,
      otp,
      oneTimePassword(user.username.length, otpSecret, otp)
    )

    if (
      !otpSecret ||
      !otp ||
      !oneTimePassword(user.username.length, otpSecret, otp)
    ) {
      throw 'Invalid OTP code'
    }
  }

  async _afterUserValidation(user) {
    if (!user) return user

    if (user.id === 1) {
      throw 'SYSTEM user is not loginable'
    }

    if (user.oneTimePasswordEnabled) {
      await this._handleOtp(user)
    }

    const sessionExpiresAt = new Date()
    sessionExpiresAt.setSeconds(
      sessionExpiresAt.getSeconds() + (await sessionTime())
    )
    this.sessionExpiresDate = sessionExpiresAt.toUTCString()

    await recordActivity(
      'userLogin',
      {
        username: user.username,
        userId: user.id,
      },
      user.id
    )

    return user
  }

  async _customCaptchaValidate() {
    if (this.params.customCaptcha !== 3) {
      throw 'Invalid jigsaw captcha'
    }
  }

  async _recaptchaValidate() {
    const data = new URLSearchParams()
    data.append('secret', '6LcvGhIjAAAAAGBSggc549Ze3erVhPBE-jIlJCpC')
    data.append('response', this.params.recaptchaToken)

    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        body: data,
      }
    )

    if (!response.ok) {
      console.log('recaptcha', await response.json())

      throw 'Failed to contact reCaptcha'
    }

    const body = await response.json()

    console.log('recaptcha', body)

    if (!body.success) {
      throw 'Invalid reCaptcha'
    }
  }

  async _beforeLoginAttempt() {
    const { password, otp, otpSecret, recaptchaToken, customCaptcha } =
      this.params.password
    this.params.password = password
    this.params.otpSecret = otpSecret
    this.params.otp = otp
    this.params.recaptchaToken = recaptchaToken
    this.params.customCaptcha = customCaptcha

    await this._recaptchaValidate()
    await this._customCaptchaValidate()

    return Promise.resolve()
  }

  logout() {
    setTimeout(async () => {
      const user = await this._getCurrentUser()

      await recordActivity('logoutUser', {}, user.id)
    }, 0)

    const response = super.logout()

    return response
  }

  async login() {
    try {
      await this._beforeLoginAttempt()
      await handleLockout(this.params.username)
      return await super.login()
    } catch (ex) {
      console.log('login error', ex.name)
      if (ex.name === 'IncorrectPasswordError') {
        await recordActivity(
          'userFailedLogin',
          {
            username: this.params.username,
          },
          1
        )
      }

      throw ex
    }
  }
}

const throwLockoutError = () => {
  throw 'Too many tries, try again later'
}

const handleLockout = async (username) => {
  const timeout = (await failedLoginLockoutTime()) * 1000

  console.log('lockout start, current timeout time', timeout, 'for', username)

  if (
    loginLocks.has(username) &&
    loginLocks.get(username) + timeout >= +new Date()
  ) {
    console.log('still locked for', username)
    return throwLockoutError()
  }

  const current = (failedLoginsCounter.get(username) || 0) + 1
  const limit = await maxFailedLoginAttempts()

  failedLoginsCounter.set(username, current)

  console.log(
    'current lockout threshold',
    limit,
    'got',
    current,
    'for',
    username
  )

  if (current > limit) {
    loginLocks.set(username, +new Date())

    console.log('current lockout exceeded for', username)

    await recordActivity('userLockout', { username }, 1)

    return throwLockoutError()
  }
}
