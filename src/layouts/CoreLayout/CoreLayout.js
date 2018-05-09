import React from 'react'
import PropTypes from 'prop-types'
import Navbar from 'containers/Navbar'
import classes from './CoreLayout.scss'
import PageTransition from 'react-router-page-transition'
import { Link } from 'react-router'
import IconNoteAdd from 'material-ui/svg-icons/action/note-add'
import 'styles/core.scss'

const Footer = () => (
  <div className={classes.footer}>Made with 🤘​ in San Francisco 🇺🇸 and Kobe 🇯🇵</div>
)

export const CoreLayout = ({ children }) => (
  <div className={classes.container}>
    <Navbar />
    <div className={classes.children}>
      {children}
    </div>
    <Footer />
    {/* <Link to='/articles/new' className={classes.button}>
      <IconNoteAdd color={'white'} size={40} />
    </Link> */}
  </div>
)

CoreLayout.propTypes = {
  children: PropTypes.element.isRequired
}

export default CoreLayout
