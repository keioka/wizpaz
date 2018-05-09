import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from 'material-ui/CircularProgress'
import classes from './LoadingSpinner.scss'

export const LoadingSpinner = ({ size }) => (
  <div className={classes.container}>
    <div className={classes.progress}>
      <div className={classes.rect1}></div>
      <div className={classes.rect2}></div>
      <div className={classes.rect3}></div>
      <div className={classes.rect4}></div>
      <div className={classes.rect5}></div>
    </div>
  </div>
)

LoadingSpinner.propTypes = {
  size: PropTypes.number
}

export default LoadingSpinner
