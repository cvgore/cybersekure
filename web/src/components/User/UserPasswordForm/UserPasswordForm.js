import { useAuth } from '@redwoodjs/auth'
import {
  Form,
  FormError,
  FieldError,
  Label,
  Submit,
  PasswordField,
} from '@redwoodjs/forms'

export const UserPasswordForm = (props) => {
  const { currentUser } = useAuth()

  const onSubmit = (data) => {
    props.onSave(data, currentUser.id)
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
          name="currentPassword"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Current password
        </Label>

        <PasswordField
          name="currentPassword"
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="currentPassword" className="rw-field-error" />

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
          validation={{ required: true }}
        />

        <FieldError name="password" className="rw-field-error" />

        <Label
          name="passwordConfirmation"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Confirm password
        </Label>

        <PasswordField
          name="passwordConfirmation"
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="passwordConfirmation" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}
