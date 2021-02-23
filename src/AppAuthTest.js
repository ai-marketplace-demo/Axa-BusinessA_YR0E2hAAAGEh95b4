import React, { useEffect, useState } from 'react';
import Amplify, { Auth, Hub, API } from 'aws-amplify';
import { AmplifyAuthenticator, withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import {
    Container, Row, Col, Dropdown
} from 'react-bootstrap';

import Layout from './components/Layout/Layout3';
import config from './config';
import 'react-toastify/dist/ReactToastify.css';

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap/dist/js/bootstrap.min');
require('bootswatch/dist/lux/bootstrap.css');
require('loaders.css/loaders.css');

const GlobalStyles = createGlobalStyle`

  
  body::-webkit-scrollbar {
    width: 0.2rem;
  }
  body::-webkit-scrollbar-track {
    background: lightgrey;
  }
  body::-webkit-scrollbar-thumb {
    background: lightgrey;
  }
  
  body {
    font-family: 'Cairo', sans-serif;
    color: black;
  }
  p{
      color: black;
  }

.search-field .search-title {
    font-size: 2rem;
}

.search-field .search-input {
    border: none;
    background-color: #f7f7f9
}  

  
  .btn{
    width:100%;
    border-radius: 11px;
  }

 
`;


Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        // identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID,
        redirectSignIn: config.cognito.REDIRECT_URI,
        redirectSignOut: config.cognito.SIGNOUT_URL
    }
});
Auth.configure({
    oauth: {
        domain: config.cognito.DOMAIN_AMPLIFY,
        redirectSignIn: config.cognito.REDIRECT_URI,
        redirectSignOut: config.cognito.SIGNOUT_URL,
        responseType: 'token'
    }
});


function getUser() {
    return Auth.currentAuthenticatedUser()
        .then((userData) => userData)
        .catch(() => Auth.federatedSignIn());
}

const App = (props) => {
    useEffect(() => {
        Hub.listen('auth', ({ payload: { event, data } }) => {
            console.log('eventAmplifyApp', event);
            switch (event) {
                case 'signIn':
                case 'cognitoHostedUI':
                    getUser().then((userData) => setUser(userData));
                    break;
                case 'signOut':
                    setUser(null);
                    localStorage.clear();
                    break;
                case 'signIn_failure':
                case 'cognitoHostedUI_failure':
                    console.log('Sign in failure', data);
                    break;
            }
        });

        getUser().then((userData) => setUser(userData));
    }, []);
    const [user, setUser] = useState(null);
    return (
        <div>
            <Router>
                {user ? (
                    <Layout />
                ) : (
                    <span />
                )}
            </Router>
            <GlobalStyles />
        </div>
    );
};

// export default withAuthenticator(App,{theme : MyTheme});
export default App; // withAuthenticator(App);
