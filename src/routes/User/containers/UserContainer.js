import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { connect } from 'react-redux'
import { firebaseConnect, populatedDataToJS, pathToJS, isLoaded, isEmpty } from 'react-redux-firebase'
import { LIST_PATH } from 'constants'
import LoadingSpinner from 'components/LoadingSpinner'
import classes from './UserContainer.scss'
import BoxUserProfileVertical from 'components/BoxUserProfileVertical'
import ArticleNewForm from '../components/ArticleNewForm'

const populates = [
  { child: 'userId', root: 'users', keyProp: 'userId' }
]

@firebaseConnect(({ params }) => ([
  {
    path: 'articles',
    populates,
    queryParams: ['orderByChild=userId', `equalTo=${params.userId}`],
  }, {
    path: `users`,
    storeAs: 'users',
    queryParams: ['orderByChild=account', `equalTo=${params.userId}`],
  }
]))
@connect(({ firebase }, { params }) => ({
  auth: pathToJS(firebase, 'auth'),
  users: populatedDataToJS(firebase, 'users'),
  articles: populatedDataToJS(firebase, 'articles', populates),
}))
export default class Users extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    children: PropTypes.object,
    articles: PropTypes.object,
    firebase: PropTypes.object
  }

  state = {
    newProjectModal: false
  }

  newSubmit = (article) => {
    const { users, auth } = this.props
    const user = Object.keys(users).map(userId => Object.assign({}, users[userId], { userId }))[0]

    const params = {
      title: article.article,
      contentType: 'article',
      userId: user.userId,
      askedByUserId: auth.uid,
      userType: 'registeredUser'
    }
    const { firebase: { pushWithMeta } } = this.props
    // push new project with createdBy and createdAt
    return pushWithMeta('articles', params)
      .then(() => this.setState({ newProjectModal: false }))
      .catch(err => {
        // TODO: Show Snackbar
        console.error('error creating new project', err) // eslint-disable-line
      })
  }
  //
  // deleteProject = ({ name }) =>
  //   this.props.firebase.remove(`articles/${name}`)
  //
  // toggleModal = (name, project) => {
  //   this.setState({ [`${name}Modal`]: !this.state[`${name}Modal`] })
  // }

  render () {
    // Project Route is being loaded
    if (this.props.children) return this.props.children

    const { articles, users } = this.props
    const { newProjectModal } = this.state

    if (!isLoaded(articles) || !isLoaded(users)) {
      return <LoadingSpinner />
    }

    if (!users) {
      <div>
        Sorry, we could not find users
      </div>
    }


   const user = Object.keys(users).map(userId => users[userId])[0]

    return (
      <div className={classes.container}>
        <BoxUserProfileVertical user={user} />
        <ArticleNewForm onSubmit={this.newSubmit} />
      </div>
    )
  }
}
