import { useRef, useState } from 'react'
import { useEffect } from 'react'

import ReCAPTCHA from 'react-google-recaptcha'

import { useAuth } from '@redwoodjs/auth'
import {
  Form,
  Label,
  TextField,
  PasswordField,
  Submit,
  FieldError,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

const LoginPage = () => {
  const { isAuthenticated, logIn, hasRole, currentUser } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      if (currentUser.oneTimePasswordEnabled) {
        return navigate(routes.oneTimePassword())
      }

      if (
        currentUser.forceNewPasswordOnLogin ||
        (currentUser.expirePasswordStartDate &&
          currentUser.expirePasswordPeriod > 0 &&
          new Date(currentUser.expirePasswordStartDate).getTime() +
            currentUser.expirePasswordPeriod * 86_400_000 <
            new Date().getTime())
      ) {
        toast('You need to set a new password')

        return navigate(routes.changePassword())
      }

      if (hasRole('admin')) {
        navigate(routes.admin())
      } else {
        navigate(routes.me())
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const usernameRef = useRef(null)
  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  const captchaRef = useRef(null)

  const [secret, setState] = useState(() =>
    Math.round(Math.random() * 8999 + 1000)
  )

  const [generatedOtp, setGeneratedOtp] = useState()

  useEffect(() => {
    setGeneratedOtp(
      Math.abs(Math.round(secret / Math.sin(usernameRef.current.value.length)))
    )
  }, [secret])

  const onSubmit = async (data) => {
    const payload = {
      password: {
        password: data.password,
        otpSecret: secret,
        otp: parseInt(data.otp),
        recaptchaToken: captchaRef.current.getValue(),
        customCaptcha: parseInt(data.customCaptcha),
      },
      username: data.username,
    }
    const response = await logIn(payload)
    captchaRef.current.reset()
    setState(Math.round(Math.random() * 8999 + 1000))
    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      toast.success('Welcome back!')
    }
  }

  return (
    <>
      <MetaTags title="Login" />

      <main className="rw-main">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">Login</h2>
            </header>

            <div className="rw-segment-main">
              <div className="rw-form-wrapper">
                <Form onSubmit={onSubmit} className="rw-form-wrapper">
                  <Label
                    name="username"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Username
                  </Label>
                  <TextField
                    name="username"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    ref={usernameRef}
                    validation={{
                      required: {
                        value: true,
                        message: 'Username is required',
                      },
                    }}
                  />

                  <FieldError name="username" className="rw-field-error" />

                  <Label
                    name="password"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Password
                  </Label>
                  <PasswordField
                    name="password"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    autoComplete="current-password"
                    validation={{
                      required: {
                        value: true,
                        message: 'Password is required',
                      },
                    }}
                  />

                  <Label
                    name="otp"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    OTP (optional) | secret:&nbsp;
                    <code title={`${generatedOtp}`}>{secret}</code>
                  </Label>
                  <PasswordField
                    name="otp"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                  />

                  <ReCAPTCHA
                    sitekey={'6LcvGhIjAAAAAA2FMrzeIYSuPEC6wdNW_4bz8kgB'}
                    ref={captchaRef}
                  />

                  <Label
                    name="customCaptcha"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Which image fits in jigsaw? Enter ID
                    <img src="https://i.imgur.com/6Lwzx8d.png"></img>
                  </Label>
                  <Label
                    name="customCaptcha"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    1<img src="https://i.imgur.com/AGmi41R.png"></img>
                  </Label>
                  <Label
                    name="customCaptcha"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    2<img src="https://i.imgur.com/2hQ2Pji.png"></img>
                  </Label>
                  <Label
                    name="customCaptcha"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    3<img src="https://i.imgur.com/wt7VLF7.png"></img>
                  </Label>
                  <TextField
                    name="customCaptcha"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                  />

                  <div className="rw-forgot-link">
                    <Link
                      to={routes.forgotPassword()}
                      className="rw-forgot-link"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <FieldError name="password" className="rw-field-error" />

                  <div className="rw-button-group">
                    <Submit className="rw-button rw-button-blue">Login</Submit>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default LoginPage
