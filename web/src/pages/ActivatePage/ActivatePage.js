import {
  Form,
  FormError,
  FieldError,
  Label,
  Submit,
  PasswordField,
} from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const ACTIVATE_APP_MUTATION = gql`
  mutation ActivateAppMutation($input: String!) {
    activateApplication(input: $input)
  }
`

export const ActivatePage = () => {
  const [activateApp, { loading, error }] = useMutation(ACTIVATE_APP_MUTATION, {
    onCompleted: () => {
      navigate(routes.me())
      toast.success('Activated! :)')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (data) => {
    activateApp({ variables: { input: data.value } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Activate app</h2>
      </header>
      <div className="rw-segment-main">
        <div className="rw-form-wrapper">
          <Form onSubmit={onSave} error={error}>
            <FormError
              error={error}
              wrapperClassName="rw-form-error-wrapper"
              titleClassName="rw-form-error-title"
              listClassName="rw-form-error-list"
            />

            <Label
              name="value"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Activation key
            </Label>

            <PasswordField
              name="value"
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ required: true }}
            />

            <FieldError name="value" className="rw-field-error" />

            <div className="rw-button-group">
              <Submit disabled={loading} className="rw-button rw-button-blue">
                Activate
              </Submit>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default ActivatePage
