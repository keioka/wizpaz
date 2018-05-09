import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import ButtonSubmit from 'components/ButtonSubmit'
import { connect } from 'react-redux'
import { TextField } from 'redux-form-material-ui'
import { ACCOUNT_FORM_NAME } from 'constants'
import classes from './ProfileNewForm.scss'
import { WithContext as ReactTags } from 'react-tag-input'
import Lottie from 'react-lottie'
import * as animationData from './data.json'

const  { DOM: { input } } = React

const InputAccount = (field) => <input type="text" name="job" value={field.defaultValue} placeholder='ex) CEO at WizPaz or Software Engineer at WizPaz' {...field.input} className={classes.input} autoCorrect="off"/>
const InputCheckBox = (field) => <input type="checkbox" id={field.id} {...field.input} />

const allTags = [
  { id: 1, name: "AI", query: "ai" },
  { id: 2, name: "Block Chain", query: 'blockchain'},
]

let isStopped = false
let isPaused = false

const wrapper = () => (
  <div class="lottie"></div>
)
const defaultOptions = {
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
}

export const ProfileNewForm = ({
  pageIndex,
  account,
  tags,
  handleSubmit,
  submitting,
  locationHash,
}) => (
  <form className={classes.container} onSubmit={handleSubmit}>
    {locationHash === '#account' &&
      <div className={classes.section} >
        <h2>Hello, {account && account.displayName}. Welcome to WizPaz!</h2>
        <h4>Please tell us your job or current status</h4>
        <Field
          name='job'
          component={InputAccount}
          defaultValue={account.job}
        />
      </div> }
    {/* {locationHash === '#tags' &&
      <div>
        <h4>Add tags</h4>
         <ReactTags
          classNames={{
            tags: classes.tags,
            tagInput: classes.tagInput,
            tagInputField: classes.tagInputField,
            selected: classes.selected,
            tag: classes.tag,
            remove: classes.remove,
            suggestions: classes.suggestions,
            activeSuggestion: classes.activeSuggestion
          }}
          tags={tags}
          suggestions={suggestions}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
        />
        {tags.map(tag => {
          return (
            <div key={`tag_${tag.id}`} className={classes.checkbox}>
              <Field name={`tags[${tag.id}]`} id={`tags[${tag.query}]`} component={InputCheckBox} />
              <label htmlFor={`tags[${tag.query}]`}>{tag.name}</label>
            </div>
          )
        })}

      </div> */}

    {locationHash === '#done' &&
      <div className={`${classes.sectionDone} ${classes.section}`}>
        <h2>Thank you, {account && account.displayName}.</h2>
        <Lottie
          options={defaultOptions}
          height={120}
          width={120}
          isStopped={isStopped}
          isPaused={isPaused}
          eventListeners={[{
            eventName: 'complete',
            callback: () => {
              isStopped = true
              isPaused = true
            }
          }]}
        />
        <h4>Your profile is all set up!</h4>
      </div>
    }

    <ButtonSubmit
      text={locationHash === '#done' ? 'Go to your page': 'OK!'}
      className={classes.submit}
    />
  </form>
)

ProfileNewForm.propTypes = {
  account: PropTypes.object,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool
}

export default reduxForm({
  form: ACCOUNT_FORM_NAME,
})(ProfileNewForm)
