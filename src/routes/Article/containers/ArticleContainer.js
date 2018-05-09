import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { connect } from 'react-redux'
import { firebaseConnect, populatedDataToJS, pathToJS, isLoaded, isEmpty } from 'react-redux-firebase'
import LoadingSpinner from 'components/LoadingSpinner'
import Avatar from 'material-ui/Avatar'
import IconClose from 'material-ui/svg-icons/content/clear'
import withPageTransition from 'components/WithPageTransition'
import classes from './ArticleContainer.scss'
import Lottie from 'react-lottie'
import AnimationSuccess from 'components/AnimationSuccess'

import * as animationData from './animationData.json'
import * as animationLikeData from './animationLikeData.json'

import BoxUserProfile from 'components/BoxUserProfile'
import CommentNewForm from '../components/CommentNewForm'
const populates = [
  { child: 'createdBy', root: 'users' }
]


/*
var obj = {
    userId: '1',
    twitterUserDisplayName: 'Kei Oka',
    twitterUserImage: 'https://pbs.twimg.com/profile_images/875087697177567232/Qfy0kRIP_400x400.jpg',
    twitterUserName: '@koka0828',
    articleId: 1,
    articleContent: 'hello I am Kei Oka hello I am Kei Oka hello I am Kei Oka'
  }
*/

const generateQuery = (params) => {
  var str = Object.keys(params).map(function(key) {
    return key + '=' + params[key];
  }).join('&');
  return window.btoa(encodeURIComponent(str))
}

const ButtonShare = ({ text, hashtags, query }) => {
  const BASE_URL = 'https://open-WizPaz.herokuapp.com/sources/'
  const url = `${BASE_URL}${query}`
  const hashtagsString = hashtags ? `,${hashtags.join(',')}` : ''
  return (
    <a
      className={classes.btnTwitter}
      target="_blank"
      href={`https://twitter.com/intent/tweet?text=${text}&hashtags=WizPaz${hashtagsString}&url=${url}`}
    >
      Share
    </a>
  )
}

@firebaseConnect(({ params }) => {
  return [{
    path: 'users',
  }]
})
@connect(({ firebase }) => ({
  users: populatedDataToJS(firebase, 'users'),
}))
class Autosuggest extends Component {
  state = {
    selectIndex: 0,
    isOpenSuggestion: false,
    currentInputValue: '',
  }

  handleSelectUser = user => {
    const { onSelectUser } = this.props
    onSelectUser(user)
    this.setState({
      isOpenSuggestion: false
    })
  }

  onChange = (event) => {
    this.setState({ currentInputValue: event.target.value, isOpenSuggestion: true })
  }

  render() {
    const isSelectedIndex = (index) => this.state.selectIndex === index
    const { users = [], usersTwitter = [] } = this.props

    const usersMapped = users ? Object.keys(users).map(userId => Object.assign({}, users[userId], { id: userId })) : []
    const usersTwitterMapped = []

    const shouldShowSuggestion =
      this.state.isOpenSuggestion &&
      (usersTwitter.length > 0 ||
       usersMapped.length > 0) &&
      this.state.currentInputValue

    const classNameItem = (index) => isSelectedIndex(index) ? `${classes.itemSuggest} ${classes.itemSuggestActive}` : `${classes.itemSuggest}`

    return (
      <div className={classes.componentAutoSuggest}>
        <input
          type="text"
          className={classes.inputSuggestion}
          onFocus={() => this.setState({ isOpenSuggestion: true })}
          placeholder='Type user name...'
          onChange={this.onChange}
        />
          { shouldShowSuggestion &&
           <div className={classes.containerSuggest}>

             {usersMapped.map((item, index) =>
               <div className={classNameItem(index)} onClick={() => this.handleSelectUser(item)}>
                 <div className={classes.itemSuggestLeft}>
                   <Avatar
                     src={item.avatarUrl}
                     style={{ border: '1px solid #eaeaea'}}
                   />
                   <div className={classes.userProfile}>
                     <h5 className={classes.userProfileName}>{item.displayName}</h5>
                     <span className={classes.userProfileJob}>{item.job}</span>
                   </div>
                 </div>
                 <div className={classes.iconTwitter}>
                 </div>
               </div>
            )}


             {usersTwitterMapped.map((item, index) =>
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

const BoxSelectedUser = ({ user, onClearUser }) => (
  <div className={classes.itemSelect}>
    <div className={classes.itemSuggestLeft}>
      <Avatar src={user.avatarUrl} />
      <div className={classes.userProfile}>
        <span className={classes.userProfileName}>{user.displayName}</span>
        <span className={classes.userProfileScreenName}>
          {user.job}
        </span>
      </div>
    </div>
    <div className={classes.iconTwitter} onClick={onClearUser}>
      <IconClose />
    </div>
  </div>
)

class ModalUserList extends Component {
  state = {
    selectedUser: null,
  }

  onSelectUser = (user) => {
    this.setState({
      selectedUser: user,
    })
  }

  handleSendRequest = () => {
    if (this.state.selectedUser) {
      this.props.handleSubmitRequest({
        userAskTo: this.state.selectedUser.id,
        userTypeAskTo: 'Original'
      })
    }
  }

  onClearUser = () => { this.setState({ selectedUser: null }) }

  render() {
    const wrapper = () => (
      <div class="lottie"></div>
    )

    const defaultOptions = {
      container: wrapper,
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        scaleMode: 'noScale',
        clearCanvas: true,
        progressiveLoad: false, // Boolean, only svg renderer, loads dom elements when needed. Might speed up initialization for large number of elements.
        hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
        className: 'some-css-class-name'
      }
    }

    const renderBodyForm = (
      <div>
        <label htmlFor="article" className={classes.label}>Who to ask?</label>
        {this.state.selectedUser ?
          <BoxSelectedUser user={this.state.selectedUser} onClearUser={this.onClearUser} /> :
          <Autosuggest onSelectUser={this.onSelectUser} />
        }
        <button className={classes.btnSubmitRequest} onClick={this.handleSendRequest}>Send Request</button>
      </div>
    )

    const renderBodySuccess = (
      <div>
        <AnimationSuccess width={250} height={250} />
      </div>
    )

    const renderBody = (
      <div className={classes.modalBody}>
        {!this.props.isSuccessRequest ? renderBodyForm : renderBodySuccess}
      </div>
    )

    const renderRequireAuth = (
      <div className={classes.modalBody}>
        <h3>Please Signup or Login to ask opinions</h3>
        <Lottie
          options={defaultOptions}
          height={460}
          width={460}
        />
      </div>
    )

    const { auth, handleCloseModal } = this.props
    return (
      <div className={classes.modal}>
        <div className={classes.btnClose} onClick={handleCloseModal}><IconClose style={{ width: 20, height: 20 }} color='#fff'/></div>
        {auth ? renderBody : renderRequireAuth}
      </div>
    )
  }
}





@firebaseConnect((props) => {
  return [{
    path: `users/${props.createdBy}`,
  }]
})
@connect(({ firebase }) => {
  return {
    users: populatedDataToJS(firebase, 'users'),
  }
})
class Comment extends Component {
  state = { isLiked: false, isStopped: true }

  render() {
    const wrapper = () => (
      <div class="lottie"></div>
    )
    const defaultOptions = {
      container: wrapper,
      loop: false,
      autoplay: false,
      animationData: animationLikeData,
      rendererSettings: {
        scaleMode: 'noScale',
        clearCanvas: false,
        progressiveLoad: false, // Boolean, only svg renderer, loads dom elements when needed. Might speed up initialization for large number of elements.
        hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
      }
    }

    const { content, createdAt, createdBy, users } = this.props
    const user = users[createdBy]
    return (
      <div className={classes.boxComment}>
        <BoxUserProfile user={user} />
        <div className={classes.commentContent}>{content}</div>
        <div className={classes.boxCommentButtom}>
          <ul className={classes.listIconActions}>
            <li className={classes.iconAction} onClick={() => this.setState({ isStopped: false })}>
              <Lottie
                options={defaultOptions}
                height={20}
                width={20}
                isStopped={this.state.isStopped}
                isPaused={this.state.isStopped}
              />
              Helpful
            </li>
            <li className={classes.iconAction}></li>
            <li className={classes.iconAction}>Share</li>
          </ul>
        </div>
      </div>
    )
  }
}






@withPageTransition
@firebaseConnect(({ params }) => {
  return [{
    path: 'articles',
  },{
    path: 'comments',
    queryParams: ['orderByChild=articleId', `equalTo=${params.articleId}`],
  }]
})
@connect(({ firebase }) => ({
  auth: pathToJS(firebase, 'auth'),
  comments: populatedDataToJS(firebase, 'comments'),
  articles: populatedDataToJS(firebase, 'articles')
}))
export default class Article extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    children: PropTypes.object,
    projects: PropTypes.object,
    firebase: PropTypes.object
  }

  state = {
    isShowUserList: false,
    isSuccessRequest: false
  }

  handleSubmit = (newComment) => {
    const { firebase: { pushWithMeta }, auth, users } = this.props
    if (!newComment) return
    const { comment } = newComment
    const params = {
      content: comment,
      userCommentBy: auth.uid,
      articleId: this.props.routeParams.articleId,
    }

    return pushWithMeta('comments', params)
      .then(onSuccess)
      .catch(err => {
        // TODO: Show Snackbar
        console.error('error on creating new article', err) // eslint-disable-line
      })
  }

  handleSubmitRequest = (newRequest) => {
    const { firebase: { pushWithMeta }, auth, users } = this.props
    if (!newRequest) return
    const params = Object.assign({}, newRequest, {
      userAskFrom: auth.uid,
      articleId: this.props.routeParams.articleId,
    })

    const onSuccess = () => {
      this.setState({
        isSuccessRequest: true,
      }, () => {
        setTimeout(() => { this.setState({ isShowUserList: false, isSuccessRequest: false }) }, 1700)
      })
    }

    return pushWithMeta('requests', params)
      .then(onSuccess)
      .catch(err => {
        // TODO: Show Snackbar
        console.error('error on creating new article', err) // eslint-disable-line
      })
  }

  render() {
    // Project Route
    const buttonStyle = {
      display: 'inline',
      margin: '10px auto'
    }
    const wrapper = () => (
      <div class="lottie"></div>
    )
    const defaultOptions = {
      container: wrapper,
      loop: false,
      autoplay: false,
      animationData: animationData,
      rendererSettings: {
        scaleMode: 'noScale',
        clearCanvas: true,
        progressiveLoad: false, // Boolean, only svg renderer, loads dom elements when needed. Might speed up initialization for large number of elements.
        hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
        className: 'some-css-class-name'
      }
    }

    const width = `${this.state.countWanted / 1000 * 100}%`
    const { articles, auth, params, twitterUsers, comments } = this.props

    if (!articles) {
      return <div className={`${classes.container}`}><LoadingSpinner /></div>
    }

    const article = articles[params.articleId]

    if (!article) {
      return <div className={`${classes.container}`}>Article is not found</div>
    }
/*
    const obj = {
    userId: '1',
    twitterUserDisplayName: 'Kei Oka',
    twitterUserImage: 'https://pbs.twimg.com/profile_images/875087697177567232/Qfy0kRIP_400x400.jpg',
    twitterUserName: '@koka0828',
    articleId: 1,
    articleContent: 'hello I am Kei Oka hello I am Kei Oka hello I am Kei Oka'
  }
*/
    const query = {}
//  generateQuery({
//       twitterUserDisplayName: formattedUser.name,
//       articleId: params.articleId,
//       articleContent: article.title,
//     })
    const isAskedToCurrentUser = auth && auth.uid && article.userId && auth.uid === article.userId

    const commentsMap = comments ? Object.keys(comments).map(commentId => Object.assign({}, comments[commentId], { commentId })) : []

    return (
      <div className={`${classes.container} fadeInRight`}>
        {this.state.isShowUserList &&
         <ModalUserList
           auth={auth}
           isSuccessRequest={this.state.isSuccessRequest}
           handleSubmitRequest={this.handleSubmitRequest}
           handleCloseModal={() => this.setState({ isShowUserList: false }) }
         />
        }
        <div className={classes.header}>
          <div className={classes.card}>
            <img src={article.urlToImage} alt=""/>
          </div>
        </div>

        <div className={classes.body}>
          <div className={classes.sectionArticleInfo}>
            <h3 className={classes.sectionArticleInfoTitle}>{article.title}</h3>
            <p className={classes.sectionArticleInfoDescription}>{article.description}</p>
            <div className={classes.sectionArticleFooter}>
              <a href={article.url} target="_blank" className={classes.textArticleReadMore}>Read more...</a>
              <div className={classes.sectionBtnTwitter}>
                <ButtonShare text={article.title} query={query} />
              </div>
            </div>
          </div>

          <div className={classes.sectionButtons}>
            <button className={classes.btnAsk} onClick={() => this.setState({ isShowUserList: true })}>
              Ask Wiz
            </button>

            <button className={classes.btnComment} onClick={() => window.scroll({ top: 10000, behavior: 'smooth'})}>
              Post your Wiz
            </button>
          </div>

          <div className={classes.sectionComments}>
            {commentsMap.length > 0 ? <h4>All Wiz</h4> : <h4>No wiz yet</h4>}
            {commentsMap && commentsMap.map(comment => <Comment {...comment} />)}
          </div>
          <div className={classes.sectionPostComments}>
            {auth ? <CommentNewForm onSubmit={this.handleSubmit} /> : <div>You need to login to comment</div>}
          </div>
        </div>
      </div>
    )
  }
}
