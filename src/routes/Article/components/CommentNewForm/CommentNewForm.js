import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { NEW_QUESTION_FORM_NAME } from 'constants'
import classes from './CommentNewForm.scss'
import ButtonSubmit from 'components/ButtonSubmit'
import Avatar from 'material-ui/Avatar'
import IconTwitter from '-!babel-loader!svg-react-loader!./twitter-icon.svg'

const InputComment = (field) => <textarea name="comment" {...field.input} rows="6" className={classes.input} />
const InputUserName = (field) => <input name="userId" type="text" {...field.input} className={classes.input} />

class Autosuggest extends Component {

  state = {
    selectIndex: 0,
    isOpenSuggestion: true,
  }

  // componentDidUpdate() {
  //   if (!this.state.isOpenSuggestion) {
  //     this.setState({
  //       isOpenSuggestion: true,
  //     })
  //   }
  // }

  handleSelectUser = user => {
    const { onSelectUser } = this.props
    onSelectUser(user)
    this.setState({
      isOpenSuggestion: false
    })
  }

  render() {
    const isSelectedIndex = (index) => this.state.selectIndex === index
    const shouldShowSuggestion =
      this.state.isOpenSuggestion &&
      (this.props.usersTwitter.length > 0 || this.props.users.length > 0) &&
      this.props.currentInputValue

    const classNameItem = (index) => isSelectedIndex(index) ? `${classes.itemSuggest} ${classes.itemSuggestActive}` : `${classes.itemSuggest}`
    return (
      <div className={classes.component}>
        <label htmlFor="comment" className={classes.label}>Who to ask?</label>
        <input
          type="text"
          className={classes.inputSuggestion}
          onFocus={() => this.setState({ isOpenSuggestion: true })}
          placeholder='Type user name...'
          onChange={this.props.onChange}
        />
          { shouldShowSuggestion &&
           <div className={classes.containerSuggest}>

             {this.props.users.map((item, index) =>
               <div className={classNameItem(index)} onClick={() => this.handleSelectUser(item)}>
                 <div className={classes.itemSuggestLeft}>
                   <Avatar
                     src={item.avatarUrl}
                   />
                   <div className={classes.userProfile}>
                     <span className={classes.userProfileName}>{item.displayName}</span>
                   </div>
                 </div>
                 <div className={classes.iconTwitter}>
                 </div>
               </div>
            )}


             {this.props.usersTwitter.map((item, index) =>
               <div className={classNameItem(index)} onClick={() => this.handleSelectUser(item)}>
                 <div className={classes.itemSuggestLeft}>
                   <Avatar
                     src={item.avatarUrl}
                   />
                   <div className={classes.userProfile}>
                     <span className={classes.userProfileName}>{item.displayName}</span>
                     <span className={classes.userProfileScreenName}>@{item.account}</span>
                   </div>
                 </div>
                 <div className={classes.iconTwitter}>
                   <IconTwitter />
                 </div>
               </div>
            )}
          </div>
        }
      </div>
    )
  }
}

const BoxSelectedUser = ({ user, onClickUser }) => (
  <div className={classes.itemSuggest}>
    <div className={classes.itemSuggestLeft}>
      <Avatar src={user.avatarUrl} />
      <div className={classes.userProfile}>
        <span className={classes.userProfileName}>{user.displayName}</span>
        <span className={classes.userProfileScreenName}>
          {/* @{user.screen_name} */}
        </span>
      </div>
    </div>
    <div className={classes.iconTwitter} onClick={onClickUser}>
      X
    </div>
  </div>
)

class CommentNewForm extends Component {

  state = {
    comment: ''
  }

  componentDidMount() {
    const addComment = (comment) => {
      this.setState({ comment })
    }

    if (window.annyang) {
      // Let's define our first command. First the text we expect, and then the function it should call
      var commands = {
        'Add comment *comment': addComment
      }

      // Add our commands to annyang
      annyang.addCommands(commands)

      // Start listening. You can call this here, or attach this call to an event, button, etc.
      annyang.start()
    }
  }

  onClick = () => {
    console.log('onClick')


  }

  render() {
    const {
      usersTwitter = [],
      users = [],
      handleSubmit,
      submitting,
      changeInputUserNameHandler,
      currentInputValue,
      onSelectUser,
      selectedUser,
      onClickUser,
    } = this.props
    return (
      <form className={classes.container} onSubmit={handleSubmit}>
        {/* {selectedUser ?
        <BoxSelectedUser user={selectedUser} onClickUser={onClickUser} /> :
        <Autosuggest
          currentInputValue={currentInputValue}
          usersTwitter={usersTwitter}
          users={users}
          onChange={(e) => changeInputUserNameHandler(e)}
          onSelectUser={onSelectUser}
        />
        } */}
        {/* <button onClick={this.onClick}>Enable voice</button> */}
        <Field
          name='comment'
          component={InputComment}
          floatingLabelText='comment'
        />
        <ButtonSubmit
          text='Share your Wiz'
          className={classes.submit}
          disabled={submitting}
        />
      </form>
    )
  }
}

CommentNewForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool
}

export default reduxForm({
  form: NEW_QUESTION_FORM_NAME
})(CommentNewForm)
