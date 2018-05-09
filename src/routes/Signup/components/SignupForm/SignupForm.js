import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import ButtonSubmit from 'components/ButtonSubmit'

import { SIGNUP_FORM_NAME } from 'constants'
import { required, validateEmail } from 'utils/form'
import classes from './SignupForm.scss'

const SignupForm = ({ pristine, submitting, handleSubmit }) => (
  <form className={classes.container} onSubmit={handleSubmit}>
    <Field
      name='username'
      component={TextField}
      className={classes.field}
      floatingLabelText='Username'
      style={{ width: '100%' }}
      validate={required}
    />
    <Field
      name='email'
      className={classes.field}
      component={TextField}
      floatingLabelText='Email'
      style={{ width: '100%' }}
      validate={[required, validateEmail]}
    />
    <Field
      name='password'
      component={TextField}
      floatingLabelText='Password'
      type='password'
      style={{ width: '100%' }}
      validate={required}
    />
    <div className={classes.submit}>
      <ButtonSubmit
        text='Signup'
        isSubmitting={submitting}
        disabled={pristine || submitting}
      />
    </div>
  </form>
)

SignupForm.propTypes = {
  pristine: PropTypes.bool.isRequired, // added by redux-form
  submitting: PropTypes.bool.isRequired, // added by redux-form
  handleSubmit: PropTypes.func.isRequired // added by redux-form
}

export default reduxForm({
  form: SIGNUP_FORM_NAME
})(SignupForm)
