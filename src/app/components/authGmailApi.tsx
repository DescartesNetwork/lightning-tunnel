import { Button } from 'antd'
import { useState } from 'react'

// Client ID and API key from the Developer Console
const CLIENT_ID =
  '31485036005-l9hnktj2733p8ehnku49cee8133n25em.apps.googleusercontent.com'
const API_KEY = 'AIzaSyBX964_-df77z-oOhH3r3dCVa7OzHOJAoE'

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
]

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly'

const AuthGmailApi = ({
  onConnected = () => {},
}: {
  onConnected: (isAuth: boolean) => void
}) => {
  const [isAuth, setIsAuth] = useState(false)

  function onAuthorizeGmail() {
    window.gapi.load('client:auth2', initClient)
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  function initClient() {
    window?.gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(function () {
        // Listen for sign-in state changes.
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(onUpdateStatus)

        // Handle the initial sign-in state.
        onUpdateStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get())
        onAuth()
      })
  }

  const onUpdateStatus = (state: boolean) => {
    setIsAuth(state)
    onConnected(state)
  }

  /**
   *  Sign in the user upon button click.
   */
  const onAuth = () => {
    window.gapi.auth2.getAuthInstance().signIn()
  }

  /**
   *  Sign out the user upon button click.
   */
  const onLogout = () => {
    window.gapi.auth2.getAuthInstance().signOut()
  }

  if (!isAuth)
    return (
      <Button type="primary" onClick={onAuthorizeGmail}>
        Authorize Gmail account
      </Button>
    )
  return (
    <Button type="primary" onClick={onLogout}>
      Logout
    </Button>
  )
}

export default AuthGmailApi
