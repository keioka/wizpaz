import React from 'react'
import PropTypes from 'prop-types'
import classes from './ButtonSubmit.scss'
import RaisedButton from 'material-ui/RaisedButton'

export const ButtonSubmit = ({
  className,
  isSubmitting,
  pristine,
  text = 'Click',
  onClick,
}) => {
  return (
    <button
      className={`${classes.container} ${className}`}
      label={isSubmitting ? 'Loading' : text}
      // style={{
      //   width: '100%',
      //   height: '58px',
      //   boxShadow: 'none',
      // }}
      // buttonStyle={{
      //   width: '100%',
      //   borderRadius: '50px',
      //   backgroundColor: 'pink',
      //   fontFamily: 'Poppins',
      //   boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
      // }}
      // rippleStyle={{
      //   height: 'auto'
      // }}
      // overlayStyle={{ height: 'auto' }}
      // disabledLabelColor='#eaeaea'
      onClick={onClick}
      disabled={pristine || isSubmitting}
    >
      <span className={classes.inner}>
        {text}
      </span>
    </button>
  )
}

ButtonSubmit.propTypes = {
  onClick: PropTypes.func
}

export default ButtonSubmit
