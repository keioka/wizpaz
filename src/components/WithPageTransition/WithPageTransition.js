import React from 'react'
import classes from './WithPageTransition.scss'
import Transition from 'react-motion-ui-pack'

export default (Component) => class WithPageTransition extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    return (
      <Transition
        component={false}
        enter={{
          opacity: 1,
          translateX: 0
         }}
         leave={{
           opacity: 0,
           translateX: 250
         }}
      >
        <div className={classes.wrapper}>
          <Component {...this.props} />
        </div>
      </Transition>
    )
  }
}
