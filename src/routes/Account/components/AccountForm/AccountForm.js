import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import ButtonSubmit from 'components/ButtonSubmit'
import RaisedButton from 'material-ui/RaisedButton'
import { TextField } from 'redux-form-material-ui'
import { ACCOUNT_FORM_NAME } from 'constants'
import ProviderDataForm from '../ProviderDataForm'
import classes from './AccountForm.scss'

export const AccountForm = ({ account, handleSubmit, submitting }) => (
  <form className={classes.container} onSubmit={handleSubmit}>
    <h4>Account Settings</h4>
    <Field
      name='displayName'
      component={TextField}
      floatingLabelText='Display Name'
    />
    <Field
      name="account"
      component={TextField}
      floatingLabelText="Account name to generate own url"
    />
    <Field
      name="job"
      component={TextField}
      floatingLabelText="job"
    />
    <Field name="email" component={TextField} floatingLabelText="Email" />
    <Field
      name='avatarUrl'
      component={TextField}
      floatingLabelText='Avatar Url'
    />
    {
      !!account && !!account.providerData &&
        <div>
          <h4>Linked Accounts</h4>
          <ProviderDataForm
            providerData={account.providerData}
          />
        </div>
    }
    <ButtonSubmit
      text='Save'
      className={classes.submit}
    />
  </form>
)

AccountForm.propTypes = {
  account: PropTypes.object,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool
}

export default reduxForm({
  form: ACCOUNT_FORM_NAME
})(AccountForm)
