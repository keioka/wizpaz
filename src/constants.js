export const LIST_PATH = '/projects'
export const ACCOUNT_PATH = '/account'
export const LOGIN_PATH = '/login'
export const SIGNUP_PATH = '/signup'
export const QUESTION_PATH = '/articles/:articleId'
export const QUESTION_NEW_PATH = '/articles/new'
export const PROFILE_NEW_PATH = '/profile'

export const USER_PATH = '/users/:userId'
export const DASHBOARD_PATH = '/me'

export const ACCOUNT_FORM_NAME = 'account'
export const LOGIN_FORM_NAME = 'login'
export const SIGNUP_FORM_NAME = 'signup'
export const NEW_PROJECT_FORM_NAME = 'newProject'
export const NEW_PROFILE_FORM_NAME = 'newProfile'
export const NEW_QUESTION_FORM_NAME = 'newArticle'

export const formNames = {
  account: ACCOUNT_FORM_NAME,
  signup: SIGNUP_FORM_NAME,
  login: LOGIN_FORM_NAME,
  newArticle: NEW_QUESTION_FORM_NAME,
}

export const paths = {
  list: LIST_PATH,
  user: USER_PATH,
  account: ACCOUNT_PATH,
  login: LOGIN_PATH,
  signup: SIGNUP_PATH,
  article: QUESTION_PATH,
  articleNew: QUESTION_NEW_PATH,
  profileNew: PROFILE_NEW_PATH,
  me: DASHBOARD_PATH
}

export default { ...paths, ...formNames }
