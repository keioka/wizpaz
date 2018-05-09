import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import AppBar from 'material-ui/AppBar'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import DownArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import Avatar from 'material-ui/Avatar'
import Logo from '-!babel-loader!svg-react-loader!./wizpaz-logo-with-word.svg'
import IconKeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import IconNoteAdd from 'material-ui/svg-icons/action/note-add'
import IconSearch from 'material-ui/svg-icons/action/search'
import Drawer from 'material-ui/Drawer'
import { connect } from 'react-redux'
import {
  firebaseConnect,
  pathToJS,
  isLoaded,
  isEmpty
} from 'react-redux-firebase'
import { ACCOUNT_PATH, LOGIN_PATH, SIGNUP_PATH, DASHBOARD_PATH } from 'constants'
import defaultUserImage from 'static/User.png'
import classes from './Navbar.scss'

const buttonStyle = {
  color: 'black',
  textDecoration: 'none',
  alignSelf: 'center'
}

const avatarStyles = {
  wrapper: { marginTop: 0 },
  button: { marginRight: '.5rem', height: '64px' },
  buttonSm: {
    marginRight: '.5rem',
    width: '30px',
    height: '64px',
    padding: '0'
  }
}

@firebaseConnect()
@connect(({ firebase }) => ({
  auth: pathToJS(firebase, 'auth'),
  account: pathToJS(firebase, 'profile')
}))
export default class Navbar extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    account: PropTypes.object,
    auth: PropTypes.object,
    firebase: PropTypes.object.isRequired
  }

  handleLogout = () => {
    this.props.firebase.logout()
    this.context.router.push('/')
  }

  render() {
    const { account, auth } = this.props
    const authExists = isLoaded(auth) && !isEmpty(auth)

    const iconButton = (
      <IconButton style={avatarStyles.button} disableTouchRipple>
        <div className={classes.avatar}>
          <div className="hidden-mobile">
            <Avatar
              src={
                account && account.avatarUrl
                  ? account.avatarUrl
                  : defaultUserImage
              }
            />
          </div>
          <div className={classes['avatar-text']}>
            <span className={`${classes['avatar-text-name']} hidden-mobile`}>
              {account && account.displayName ? account.displayName : 'User'}
            </span>
            <DownArrow color="white" />
          </div>
        </div>
      </IconButton>
    )

    const iconButtonNoUser = (
      <IconButton style={avatarStyles.button} disableTouchRipple>
        <div className={classes.avatar}>
          <div className="hidden-mobile">
            <Avatar
              src={'https://keypointintelligence.com/img/anonymous.png'}
            />
          </div>
        </div>
      </IconButton>
    )
    const mainMenu = (
      <div
        style={{
          display: 'flex',
          fontFamily: 'Poppins',
          flex: 1,
          alignItems: 'center'
        }}
      >
        <MenuItem
          style={{ fontFamily: 'Poppins', fontSize: '0.9rem', fontWeight: '600' }}
          className={classes.menuText}
          primaryText="Signup"
          onTouchTap={() => { this.context.router.push(SIGNUP_PATH); mixpanel.track("go to signup page") } }
        />
        {/* <MenuItem
          className={classes.menuText}
          primaryText="Login"
          onTouchTap={() => { this.context.router.push(LOGIN_PATH); mixpanel.track("go to login page") } }
        /> */}
      </div>
    )

    const leftMenu = (
      <div className={classes.leftMenu}>
        {this.context.router.location.pathname !== '/' ?
          <IconKeyboardArrowLeft onClick={this.context.router.goBack} color={'black'} style={{ transform: 'scale(1.2)' }} /> :
          <Link to='/articles/new' className={classes.buttonArticleNew}>
            <IconNoteAdd size={40} color={'#696969'} />
            <span>Add</span>
          </Link>
        }
      </div>
    )

    const rightMenu = authExists ? (
      <IconMenu
        iconButtonElement={iconButton}
        targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        animated={false}
        style={{ flex: 1 }}
      >
        <MenuItem
          primaryText="Profile"
          style={{ fontFamily: 'Poppins', fontSize: '0.9rem', fontWeight: '600' }}
          onTouchTap={() => this.context.router.push(DASHBOARD_PATH)}
        />
        <MenuItem
          primaryText="Account Settings"
          style={{ fontFamily: 'Poppins', fontSize: '0.9rem', fontWeight: '600' }}
          onTouchTap={() => this.context.router.push(ACCOUNT_PATH)}
        />
        <MenuItem
          primaryText="Sign out"
          style={{ fontFamily: 'Poppins', fontSize: '0.9rem', fontWeight: '600' }}
          onTouchTap={this.handleLogout}
        />
      </IconMenu>
    ) : (
      mainMenu
    )

    return (
      <AppBar
        title={
          <Link to='/' className={classes.brand}>
            <Logo />
          </Link>
        }
        style={{ background: 'white', position: 'sticky', display: 'flex' }}
        titleStyle={{ flex: 10 }}
        iconStyleRight={{ flex: 1 }}
        position='fixed'
        color='black'
        showMenuIconButton={true}
        iconElementLeft={leftMenu}
        iconElementRight={isLoaded(auth, account) ? rightMenu : null}
        iconStyleRight={authExists ? avatarStyles.wrapper : {}}
        className={classes.appBar}
      />
    )
  }
}
