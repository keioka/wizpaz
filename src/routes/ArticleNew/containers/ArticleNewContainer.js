import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { connect } from 'react-redux'
import { firebaseConnect, populatedDataToJS, pathToJS, isLoaded, isEmpty } from 'react-redux-firebase'
import LoadingSpinner from 'components/LoadingSpinner'
import withPageTransition from 'components/WithPageTransition'
import AnimationSuccess from 'components/AnimationSuccess'

import { UserIsAuthenticated } from 'utils/router'
import ArticleNewForm from '../components/ArticleNewForm'
import classes from './ArticleNewContainer.scss'


const populates = [
  { child: 'createdBy', root: 'users' }
]

const paramsUser = () => {

  return {
    content: '',
    contentType: '',
    ref: '',
    refURL: '',
    tag: '',
    title: '',
    userId: '',
    userType: ''
  }
}

const generateUser = ({ user, userType }) => {

  return userType === 'twitterUser' ?
    {
      displayName: user.name,
      account: user.screen_name,
      avatarUrl: user.profile_image_url,
      userType: userType,
      userId: user.id
    } : {
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      userType: 'registeredUser',
    }
}

@UserIsAuthenticated
@withPageTransition
@firebaseConnect(props => {
  return [{
    path: 'users',
  }]
})
@connect(({ firebase }) => ({
  auth: pathToJS(firebase, 'auth'),
  users: populatedDataToJS(firebase, 'users')
}))
export default class ArticleNew extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    children: PropTypes.object,
    projects: PropTypes.object,
    firebase: PropTypes.object
  }

  state = {
    usersTwitter: [],
    currentInputValue: '',
    selectedUser: null,
    isSuccessAddNewArticle: false,
  }

  timeout = 0

  onSelectUser = (user) => {
    this.setState({
      selectedUser: user,
    })
  }

  createNewPost = (newArticle) => {

    const { firebase: { pushWithMeta }, auth, users } = this.props
    if (!newArticle) return
    const { author, date, description, image, publisher, logo, url } = newArticle
    const params = {
      author,
      description,
      publishedAt: date,
      source: {
        id: publisher.toLowerCase(),
        name: publisher,
        imageUrlLogo: logo.url,
      },
      url,
      urlToImage: image.url,
      title: newArticle.title,
      addedByUserId: auth.uid,
    }
    // push new project with createdBy and createdAt
    const onSuccess = (res) => {
      this.setState({
        isSuccessAddNewArticle: true,
      }, () => {
        setTimeout(() => { this.context.router.push(`/articles/${res.path.o[1]}`) }, 2500)
      })

    }
    return pushWithMeta('articles', params)
      .then(onSuccess)
      .catch(err => {
        // TODO: Show Snackbar
        console.error('error on creating new article', err) // eslint-disable-line
      })
  }

  changeInputUserNameHandler = (event) => {
    var searchText = event.target.value // this is the search text
    // if(this.timeout) clearTimeout(this.timeout);
    //   this.timeout = setTimeout(() => {
    //     fetch(`https://pbjf44w9hj.execute-api.us-east-1.amazonaws.com/dev/getTwitterUser?userNameOrId=${searchText}`)
    //     .then((res) => res.json())
    //     .then((result) => {
    //       if(result.data.data) {
    //         this.setState({
    //           usersTwitter: result.data.data,
    //         })
    //       }
    //     })
    //     .catch((error) => console.error(error))
    //   }, 3000);
     this.setState({
        currentInputValue: searchText,
     })
  }

  clearSelectedUser = () => {
    this.setState({
      currentInputValue: '',
      selectedUser: null,
    })
  }

  render() {
    // Project Route
    const { users } = this.props
    const { usersTwitter } = this.state
    let usersMapped = []
    const twitterUsersMapped = usersTwitter.length > 0 ?
      usersTwitter.map(user => generateUser({ user, userType: 'twitterUser' })) :
      []

    if (users) {
      usersMapped = Object.keys(users).map(itemKey => Object.assign({}, users[itemKey], { id: itemKey }))
    }
    const regexUserName = new RegExp(this.state.currentInputValue)
    const userFiltered = usersMapped.filter(user => regexUserName.test(user.displayName.split(' ').join('')))

    return (
      <div className={classes.container}>
        <h2>Add New Article</h2>
        {this.state.isSuccessAddNewArticle ?
        <div className={classes.containerSuccess}>
          <AnimationSuccess
            height={160}
            width={160}
          />
          <h3>Added news article. Thank you!</h3>
        </div>:
        <ArticleNewForm
          onSubmit={this.createNewPost}
          onClickUser={this.clearSelectedUser}
          onSelectUser={this.onSelectUser}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          currentInputValue={this.state.currentInputValue}
          usersTwitter={twitterUsersMapped}
          users={userFiltered}
          selectedUser={this.state.selectedUser}
          changeInputUserNameHandler={this.changeInputUserNameHandler}
        />
        }
      </div>
    )
  }
}
