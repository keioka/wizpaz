import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import { connect } from 'react-redux'
import { firebaseConnect, pathToJS, populatedDataToJS, isLoaded } from 'react-redux-firebase'
import { reduxFirebase as fbReduxSettings } from 'config'
import { UserIsAuthenticated } from 'utils/router'
import defaultUserImageUrl from 'static/User.png'
import Avatar from 'material-ui/Avatar'
import { DASHBOARD_PATH } from 'constants'

import LoadingSpinner from 'components/LoadingSpinner'
import ProfileNewForm from '../components/ProfileNewForm'
import classes from './ProfileNewContainer.scss'

@UserIsAuthenticated // redirect to /login if user is not authenticated
@firebaseConnect(props => {
  return [{
    path: 'tags',
  }, {
    path: 'categories',
  }]
})
@connect(({ firebase }) => ({
  auth: pathToJS(firebase, 'auth'),
  account: pathToJS(firebase, 'profile'),
  tags: populatedDataToJS(firebase, 'tags'),
  categories: populatedDataToJS(firebase, 'categories'),
}))
export default class ProfileNewContainer extends Component {
  static propTypes = {
    account: PropTypes.object,
    auth: PropTypes.object,
    firebase: PropTypes.shape({
      logout: PropTypes.func.isRequired
    })
  }

  state = {
    pageIndex: 0,
    tags: [],
    categories: [],
  }

  handleDelete = (i) => {
    let tags = this.state.tags
    tags.splice(i, 1)
    this.setState({tags: tags})
  }

  handleAddition = (tag) => {
    let tags = this.state.tags
    tags.push({
      id: tags.length + 1,
      text: tag
    })
    this.setState({ tags: tags })
  }

  handleDrag = (tag, currPos, newPos) => {
    let tags = this.state.tags

    // mutate array
    tags.splice(currPos, 1)
    tags.splice(newPos, 0, tag)

    // re-render
    this.setState({ tags: tags })
  }

  updateAccount = (newAccount) => {
    const { firebase: { update }, auth } = this.props
    // corresponds to /users/${uid}
    if (this.props.location.hash === '' || this.props.location.hash === '#account') {
      update(`${fbReduxSettings.userProfile}/${auth.uid}`, newAccount)
      this.props.router.push('/profile/#done')
    } else if (this.props.location.hash === '#tags') {
      const tags = newAccount.tags ? newAccount.tags.map((tag, index) => tag && index) : []
      update(`${fbReduxSettings.userProfile}/${auth.uid}`, { tags })
      this.props.router.push('/profile/#done')
    } else {
      this.props.router.push(DASHBOARD_PATH)
    }
  }

  render() {
    const { account, tags, categories } = this.props
    const mappedTags = tags ? tags.map((tag, index) => Object.assign({}, tag, { id: index })) : []
    const mappedCategories = categories ? categories.map((category, index) => Object.assign({}, category, { id: index })) : []

    if (!isLoaded(account)) {
      return <LoadingSpinner />
    }

    return (
      <div className={classes.container}>
        <ProfileNewForm
          account={account}
          pageIndex={this.state.pageIndex}
          onSubmit={this.updateAccount}
          tags={mappedTags}
          categories={categories}
          locationHash={this.props.location.hash || '#account'}
        />
      </div>
    )
  }
}
