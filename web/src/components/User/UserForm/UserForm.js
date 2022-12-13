import { useEffect, useState } from 'react'

import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  NumberField,
  CheckboxField,
  Submit,
  SelectField,
} from '@redwoodjs/forms'

import { serializePcr, deserializePcr } from 'src/lib/password'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

const UserForm = (props) => {
  const defaultPcr = deserializePcr(props.user?.passwordComplexityRules)

  const [pcrMinLength, setPcrMinLength] = useState(defaultPcr.pcrMinLength || 0)
  const [pcrSpecialChars, setPcrSpecialChars] = useState(
    defaultPcr.pcrSpecialChars || false
  )
  const [pcrLetters, setPcrLetters] = useState(defaultPcr.pcrLetters || false)
  const [pcrEnable, setPcrEnable] = useState(
    Object.values(defaultPcr).length > 0
  )

  useEffect(() => {
    if (!pcrEnable) {
      setPcrMinLength(0)
      setPcrSpecialChars(false)
      setPcrLetters(false)
    }
  }, [pcrEnable])

  const onSubmit = (data) => {
    props.onSave(
      {
        ...data,
        passwordComplexityRules: serializePcr({
          pcrEnable,
          pcrMinLength,
          pcrSpecialChars,
          pcrLetters,
        }),
      },
      props?.user?.id
    )
  }

  return (
    <div className="rw-form-wrapper">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="username"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Username
        </Label>

        <TextField
          name="username"
          defaultValue={props.user?.username}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="username" className="rw-field-error" />

        <Label
          name="roles"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Roles
        </Label>

        <SelectField
          name="roles"
          defaultValue={props.user?.roles || 'user'}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        >
          <option value="admin">admin</option>
          <option value="role1">role1</option>
          <option value="role2">role2</option>
          <option value="role3">role3</option>
          <option value="user">user</option>
        </SelectField>

        <FieldError name="roles" className="rw-field-error" />

        <Label
          name="expirePasswordPeriod"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Expire password period
        </Label>

        <NumberField
          name="expirePasswordPeriod"
          defaultValue={props.user?.expirePasswordPeriod}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="expirePasswordPeriod" className="rw-field-error" />

        <Label
          name="expirePasswordStartDate"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Expire password start date
        </Label>

        <DatetimeLocalField
          name="expirePasswordStartDate"
          defaultValue={formatDatetime(props.user?.expirePasswordStartDate)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="expirePasswordStartDate" className="rw-field-error" />

        <Label
          name="forceNewPasswordOnLogin"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Force new password on login
          <CheckboxField
            name="forceNewPasswordOnLogin"
            defaultChecked={props.user?.forceNewPasswordOnLogin}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        </Label>

        <FieldError name="forceNewPasswordOnLogin" className="rw-field-error" />

        <Label
          name="passwordComplexityRules"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Password complexity rules
        </Label>

        <div className="my-2 flex flex-row gap-x-2">
          <label htmlFor="pcrEnable" className="font-bold">
            Enable
          </label>
          <input
            id="pcrEnable"
            type="checkbox"
            onChange={(ev) => setPcrEnable(ev.target.checked)}
            checked={pcrEnable}
          />
        </div>

        <div className="my-2 flex flex-row gap-x-2">
          <b className="font-bold">Min password length</b>
          <input
            type="number"
            onInput={(ev) => setPcrMinLength(ev.target.value)}
            min="0"
            value={pcrMinLength}
          />
        </div>

        <div className="my-2 flex flex-row gap-x-2">
          <label htmlFor="pcrSpecialChars" className="font-bold">
            Require special chars or numbers
          </label>
          <input
            id="pcrSpecialChars"
            type="checkbox"
            onChange={(ev) => setPcrSpecialChars(ev.target.checked)}
            checked={pcrSpecialChars}
          />
        </div>

        <div className="my-2 flex flex-row gap-x-2">
          <label htmlFor="pcrLetters" className="font-bold">
            Require letters (a/A)
          </label>
          <input
            type="checkbox"
            id="pcrLetters"
            onChange={(ev) => setPcrLetters(ev.target.checked)}
            checked={pcrLetters}
          />
        </div>

        <FieldError name="passwordComplexityRules" className="rw-field-error" />

        <Label
          name="expiresAt"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Expires at
        </Label>

        <DatetimeLocalField
          name="expiresAt"
          defaultValue={formatDatetime(props.user?.expiresAt)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="expiresAt" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default UserForm
