import React from 'react'
import PropTypes from 'prop-types'
import Avatar from 'material-ui/Avatar'
import classes from './BoxUserProfileVertical.scss'

const BoxUserProfileVertical = ({ user = {} }) => (
  <div className={classes.container}>
    <Avatar size={80} src={user.avatarUrl.replace(/normal/, '400x400')} />
    <div className={classes.userProfileName}>
      <h1>{user.displayName}</h1>
      <span className={classes.userTitle}>{user.title}</span>
    </div>
  </div>
)

BoxUserProfileVertical.propTypes = {
  user: PropTypes.object
}

export default BoxUserProfileVertical
