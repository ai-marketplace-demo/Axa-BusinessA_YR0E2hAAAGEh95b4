import './App.less';
import {Layout} from "./components/layout";
import React, {useEffect, useState} from 'react';

import GlobalStyle from './globalStyles';
import Router from "./Router";
import {BrowserRouter} from "react-router-dom";
import Amplify, { Auth, Hub } from 'aws-amplify';
import config from "./config";
import 'antd/dist/antd.css';

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID,
        redirectSignIn: config.cognito.REDIRECT_URI,
        redirectSignOut: config.cognito.SIGNOUT_URL
    }
})
Auth.configure({
    oauth: {
        "domain": config.cognito.DOMAIN,
        redirectSignIn: config.cognito.REDIRECT_URI,
        redirectSignOut: config.cognito.SIGNOUT_URL,
        "responseType": "token"
    }
})


function getUser() {
    return Auth.currentAuthenticatedUser()
        .then(userData => userData)
        .catch(() => Auth.federatedSignIn());
}

const App = (props) => {

    useEffect(() => {

        Hub.listen('auth', ({payload: {event, data}}) => {
            console.log('eventAmplifyApp', event)
            switch (event) {
                case 'signIn':
                case 'cognitoHostedUI':
                    getUser().then(userData => setUser(userData));
                    break;
                case 'oAuthSignOut':
                    setUser(null);
                    localStorage.clear()
                    break;
                case 'signIn_failure':
                case 'cognitoHostedUI_failure':
                    console.log('Sign in failure', data);
                    break;
            }
        });

        getUser().then(userData => setUser(userData));
    }, []);
    const [user, setUser] = useState(null);
    return<BrowserRouter>
        <GlobalStyle />
        {user ? (
            <Layout>
                <Router/>
            </Layout>
        ) : (
            <span/>
        )}
    </BrowserRouter>
}

export default App;
