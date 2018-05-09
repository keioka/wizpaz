import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from 'material-ui/CircularProgress'
import classes from './ButtonOauth.scss'
import IconTwitter from '-!babel-loader!svg-react-loader!./twitter-icon.svg'
export const ButtonOauth = ({ className, onClick, text = 'Login', provider = 'twitter'}) => {
  const btnColor = provider === 'twitter' ? classes.colorTwitter : classes.colorFacebook
  const Icon = provider === 'twitter' ? <IconTwitter className={classes.icon} /> : <IconFacebook className={classes.icon} />
  return (
    <div className={`${classes.container} ${btnColor} ${className}`} onClick={onClick}>
      <div className={classes.inner}>
        {Icon}
        {text}
      </div>
      <div className={classes.progress}>
      </div>
    </div>
  )
}

ButtonOauth.propTypes = {
  onClick: PropTypes.func
}

export default ButtonOauth
