import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { NEW_QUESTION_FORM_NAME } from 'constants'
import classes from './ArticleNewForm.scss'
import ButtonSubmit from 'components/ButtonSubmit'
import Avatar from 'material-ui/Avatar'
import IconTwitter from '-!babel-loader!svg-react-loader!./twitter-icon.svg'

const InputArticle = (field) => <textarea name="article" {...field.input} rows="6" className={classes.input} />
const InputUserName = (field) => <input name="userId" type="text" {...field.input} className={classes.input} />

class ArticleNewForm extends Component {
  render() {
    const {
      usersTwitter,
      users,
      handleSubmit,
      submitting,
      changeInputUserNameHandler,
      currentInputValue,
      onSelectUser,
      selectedUser,
    } = this.props

    return (
      <form className={classes.container} onSubmit={handleSubmit}>
        <Field
          name='article'
          component={InputArticle}
          floatingLabelText='article'
        />
        <ButtonSubmit
          text='Ask'
          className={classes.submit}
          disabled={submitting}
        />
      </form>
    )
  }
}

ArticleNewForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool
}

export default reduxForm({
  form: NEW_QUESTION_FORM_NAME
})(ArticleNewForm)
