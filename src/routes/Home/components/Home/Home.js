import React from 'react'
import Theme from 'theme'
import { Link } from 'react-router'
import { paths } from 'constants'
import classes from './Home.scss'
import Slider from 'react-slick'
import Avatar from 'material-ui/Avatar'
import moment from 'moment'
import withPageTransition from 'components/WithPageTransition'
import LoadingSpinner from 'components/LoadingSpinner'
import 'css-loader!slick-carousel/slick/slick.css'
import 'css-loader!slick-carousel/slick/slick-theme.css'

const authWrapperUrl = 'https://github.com/mjrussell/redux-auth-wrapper'
const reactRouterUrl = 'https://github.com/ReactTraining/react-router'
import randomColor from 'randomcolor'
import { connect } from 'react-redux'
import BoxUserProfile from 'components/BoxUserProfile'
import {
  firebaseConnect,
  populatedDataToJS,
  pathToJS,
  isLoaded,
  isEmpty
} from 'react-redux-firebase'

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

class Card extends React.Component {

  render() {
    var color = randomColor({ luminosity: 'dark' })
    const { tag, title, userId, id, urlToImage, publishedAt } = this.props.data
    const { user, size } = this.props
    const { reviews } = this.props
    const LIMIT_TEXT_LENGTH = 60
    let titleTransform = title.length > LIMIT_TEXT_LENGTH ? title.substr(0, LIMIT_TEXT_LENGTH) + '...' : title
    const n = title ? (title.length % 10) * 2 + 1 : 1
    const num = `number${n}`
    const sizeClass = size === 'small' ? classes.cardSmallSize : classes.cardRegularSize
    return (
      <Link
        to={`/articles/${id}`}
      >
      <div className={`${classes.card} ${sizeClass}`}>
        <div className={classes.cardHeader}>
          <img src={urlToImage} alt=""/>
        </div>
        <div className={classes.cardUserProfile}>
          <h3>{title}</h3>
        </div>
        <div className={classes.cardFooter}>
          {moment(publishedAt).fromNow()}
        </div>
      </div>
    </Link>
    )
  }
}

const menu = [
  { title: 'ALL', query: 'all' },
  { title: 'AI', query: 'ai' },
  { title: 'Block Chain', query: 'bc' },
  { title: 'Robot', query: 'rb' },
  { title: 'VTOL', query: 'vt' },
  { title: 'Marketing', query: 'ma' },
  { title: 'Crypto currency', query: 'cc' },
]

class MenuSlider extends React.Component {
  state = {
    activeIndex: 0,
  }

  render () {

    var settings = {
      arrows: false,
      infinite: true,
      speed: 500,
      swipe: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      centerMode: true,
      touchMove: true,
      touchThreshold: 10,
      focusOnSelect: true,
      responsive: [
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
      ],
      className: classes.slideContainer,
      afterChange: (index) => {
        this.setState({
          activeIndex: index,
        }, () => {
          const currentQuery = menu[this.state.activeIndex].query
          this.props.changeQuery(currentQuery)
        })
      }
    }

    const { activeIndex } = this.state
    const isActive = (index, activeIndex) => index === activeIndex
    const classNameItem = ({ index, activeIndex } ) => `${classes.tag} ${isActive(index, activeIndex) ? classes.active : null}`
    const itemsMenu = menu.map((item, index) => <div className={classes.tagContainer}><h3 className={classNameItem({ index, activeIndex })}>{item.title}</h3></div>)
    return (
      <Slider {...settings}>
        {itemsMenu}
      </Slider>
    );
  }
}

@firebaseConnect(props => {
  return [{
    path: 'articles',
  }, {
    path: 'users',
  }]
})
@connect(({ firebase }) => ({
  reviews: populatedDataToJS(firebase, 'reviews'),
  articles: populatedDataToJS(firebase, 'articles'),
  users: populatedDataToJS(firebase, 'users'),
}))
export default class Home extends React.Component {
  state = {
    query: 'all',
  }

  constructor() {
    super()
    this.changeQuery = this.changeQuery.bind(this)
  }

  changeQuery(query) {
    this.setState({
      query
    })
  }

  render() {
    const { query } = this.state
    const { articles } = this.props

    if (!articles) {
      return <div></div>
    }

    const articleMapped = Object.keys(articles).map((key) => Object.assign({}, articles[key], { id: key }))
    const data = query !== 'all' ? articleMapped.filter(item => item.query === query) : articleMapped
    // const popularArticle = data.splice(0, 1)[0]
    return (
      <div className={classes.layout}>
        {/* <MenuSlider changeQuery={this.changeQuery} /> */}
        {/* <div className={classes.container} style={{ color: Theme.palette.primary2Color }}> */}
          {/* <Card data={popularArticle} /> */}
        {/* </div> */}
        <div className={classes.container} style={{ color: Theme.palette.primary2Color }}>
          {data.map(article => <Card data={article} size={'small'} />)}
        </div>
      </div>
    )
  }
}
