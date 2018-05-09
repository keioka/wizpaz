import React from 'react'
import PropTypes from 'prop-types'
import Avatar from 'material-ui/Avatar'
import classes from './BoxUserProfile.scss'
import { Link } from 'react-router'

const Body = ({ user }) => (
  <div className={classes.userProfileRow}>
    <Avatar size={60} src={user.avatarUrl} />
    <div className={classes.userProfileName}>
      <span className={classes.userName}>{user.displayName}</span>
      <span className={classes.userTitle}>{user.job}</span>
    </div>
  </div>
)

const BoxUserProfile = ({ user = {} }) => (
  <div>
   {user.userType !== 'twitterUser' ?
      <Link to={`/users/${user.account}`} className={classes.component}>
        <Body user={user} />
      </Link> :
      <Body user={user} />
    }
  </div>
)

BoxUserProfile.propTypes = {
  user: PropTypes.object
}

export default BoxUserProfile
