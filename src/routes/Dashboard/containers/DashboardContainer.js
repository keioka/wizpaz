import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { firebaseConnect, pathToJS, populatedDataToJS, isLoaded } from 'react-redux-firebase'
import Snackbar from 'material-ui/Snackbar'
import Avatar from 'material-ui/Avatar'

import { connect } from 'react-redux'
import { UserIsAuthenticated } from 'utils/router'
import LoadingSpinner from 'components/LoadingSpinner'
import BoxUserProfileVertical from 'components/BoxUserProfileVertical'
import withPageTransition from 'components/WithPageTransition'

import { SIGNUP_PATH } from 'constants'

import classes from './DashboardContainer.scss'

@UserIsAuthenticated // redirect to list page if logged in
@withPageTransition
@firebaseConnect(({ authData }) => {
  const requestsQueryParams = authData ? ['orderByChild=userAskTo', `equalTo=${authData.uid}`] : null
  return [{
    path: 'tags',
  },{
    path: 'users',
  },{
    path: 'requests',
    requestsQueryParams,
  }, {
    path: 'articles',
  }]
})
@connect(({ firebase }) => ({
  profile: pathToJS(firebase, 'profile'),
  articles: populatedDataToJS(firebase, 'articles'),
  authError: pathToJS(firebase, 'authError'),
  users: populatedDataToJS(firebase, 'users'),
  tags: populatedDataToJS(firebase, 'tags'),
  requests: populatedDataToJS(firebase, 'requests'),
}))
export default class DashboardContainer extends Component {
  // static propTypes = {
  //   firebase: PropTypes.shape({
  //     login: PropTypes.func.isRequired
  //   }),
  //   authError: PropTypes.shape({
  //     message: PropTypes.string // eslint-disable-line react/no-unused-prop-types
  //   })
  // }
  //
  // state = {
  //   snackCanOpen: false
  // }
  //
  // handleLogin = loginData => {
  //   console.log(loginData)
  //   this.setState({
  //     snackCanOpen: true
  //   })
  //
  //   return this.props.firebase.login(loginData)
  // }
  //
  // providerLogin = (provider) =>
  //   this.handleLogin({ provider, type: 'popup' })

  render () {
    const { authError, profile, tags, requests, articles, users } = this.props
    if (!profile) {
      return (
        <div><LoadingSpinner /></div>
      )
    }
    let requestsMap = []
    if (requests) {
      requestsMap = Object.keys(requests).map(requestkey => Object.assign({}, requests[requestkey], { id: requestkey }))
    }

    return (
      <div className={classes.container}>
        <BoxUserProfileVertical user={profile} />
        <ul className={classes.listTag}>
          {tags && profile.tags.map(tagId => <li className={classes.tag}>{tags[tagId].name}</li>)}
        </ul>
        <h3>Wiz Requests</h3>
        <ul className={classes.listRequests}>
          {requestsMap && users && requestsMap.map(request =>
              <a href={`/articles/${request.articleId}`} className={classes.itemUser}>
                <Avatar src={users[request.userAskFrom].avatarUrl} />
                <span className={classes.itemUserMessage}>{users[request.userAskFrom].displayName} is asking your Wiz. Go to news page.</span>
              </a>
           )
          }
        </ul>
      </div>
    )
  }
}
