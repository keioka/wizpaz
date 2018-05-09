import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { NEW_QUESTION_FORM_NAME } from 'constants'
import classes from './ArticleNewForm.scss'
import ButtonSubmit from 'components/ButtonSubmit'
import LoadingSpinner from 'components/LoadingSpinner'

import Avatar from 'material-ui/Avatar'
import MicrolinkCard from 'react-microlink'
import IconTwitter from '-!babel-loader!svg-react-loader!./twitter-icon.svg'
import IconSearch from 'material-ui/svg-icons/action/search'

const InputArticle = (field) => <textarea name="article" {...field.input} rows="6" className={classes.input} />
const InputUserName = (field) => <input name="userId" type="text" {...field.input} className={classes.input} />

class InputUrl extends Component {

  // componentDidUpdate() {
  //   if (!this.state.isOpenSuggestion) {
  //     this.setState({
  //       isOpenSuggestion: true,
  //     })
  //   }
  // }

  render() {
    return (
      <div className={classes.component}>
        <input
          type="text"
          className={classes.inputSuggestion}
          placeholder='Copy and paste URL'
          onChange={this.props.onChange}
        />
        <button className={classes.btnSearchLink} onClick={this.props.onClickSubmitLink}>
          <div className={classes.btnSearchLinkInner}>
            <IconSearch color='white'/>
          </div>
        </button>
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

class CardLink extends Component {
  render() {
    const { title, description, image, logo, url } = this.props.linkData
    return (
      <div className={classes.card}>
        <div className={classes.cardHeader}>
          <img src={image.url} alt=""/>
        </div>
        <div className={classes.cardUserProfile}>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className={classes.cardFooter}>
          {/* {publishedAt} */}
        </div>
      </div>
    )
  }
}

const validateURL = (textval) => {
  var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

export default class ArticleNewForm extends Component {

  state = { link: '', linkData: null, isLinkError: false, isLoading: false }

  handleFetchMetaData = (event) => {
    event.preventDefault()
    const { link } = this.state
    const isValidUrl = validateURL(link)
    if (!isValidUrl) {
      this.setState({ isLinkError: true })
    }

    const fetchMetaData = () => {
      fetch(`https://api.microlink.io?url=${link}`)
      .then(response => response.json())
      .then(result => this.setState({ linkData: result.data, isLinkError: false, isLoading: false }))
      .catch(error => this.setState({ isLinkError: true }))
    }

    this.setState({ isLoading: true }, fetchMetaData)
  }

  onChange = (event) => {
    this.setState({ link: event.target.value })
  }

  render() {
    const {
      handleSubmit,
      onSubmit,
      changeInputUserNameHandler,
      currentInputValue,
      onSelectUser,
      selectedUser,
      onClickUser,
    } = this.props

    return (
      <form className={classes.container} onSubmit={(event) => { event.preventDefault(); onSubmit(this.state.linkData)} }>
        <InputUrl
          onChange={this.onChange}
          onClickSubmitLink={this.handleFetchMetaData}
        />
        {this.state.linkData && <CardLink linkData={this.state.linkData} />}
        {this.state.isLoading && <div><LoadingSpinner /></div>}
        {this.state.isLinkError && <div>This url is not found or valid</div>}
        {this.state.linkData && <ButtonSubmit
          text='Share'
          className={classes.submit}
        />}
      </form>
    )
  }
}

ArticleNewForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool
}
