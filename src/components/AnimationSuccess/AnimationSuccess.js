import React from 'react'
import PropTypes from 'prop-types'

import Lottie from 'react-lottie'
import * as animationData from './animationData.json'

const wrapper = () => (
  <div class="lottie"></div>
)

const AnimationSuccess = ({ height, width }) => (
  <Lottie
    options={{
      container: wrapper,
      loop: false,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        scaleMode: 'noScale',
        clearCanvas: true,
        progressiveLoad: false, // Boolean, only svg renderer, loads dom elements when needed. Might speed up initialization for large number of elements.
        hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
        className: 'some-css-class-name'
      }
    }}
    height={height}
    width={width}
  />
)

AnimationSuccess.propTypes = {
  heigth: PropTypes.number,
  width: PropTypes.number,
}

export default AnimationSuccess
