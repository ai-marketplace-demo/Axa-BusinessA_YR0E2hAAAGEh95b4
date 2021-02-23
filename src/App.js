import React, { useEffect, useState } from 'react';
import {
    AmplifyAuthenticator,
    AmplifySignUp,
    AmplifySignIn,
    AmplifyConfirmSignIn,
    AmplifyVerifyContact,
    AmplifyConfirmSignUp
} from '@aws-amplify/ui-react';
import Amplify, { Auth } from 'aws-amplify';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import config from './config';
import Layout from './components/Layout/Layout';

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap/dist/js/bootstrap.min');
require('bootswatch/dist/cosmo/bootstrap.min.css');


const GlobalStyles = createGlobalStyle`
  body::-webkit-scrollbar {
    width: 0.2rem;
  }
  body::-webkit-scrollbar-track {
    background: red;
  }
  body::-webkit-scrollbar-thumb {
    background: blue;

  }
`;

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        // identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    API: {
        endpoints: [
            {
                name: 'datahub',
                endpoint: config.apiGateway.URL,
                region: config.apiGateway.REGION
            },
        ]
    }
});

const App = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuth = async () => {
        try {
            const session = await Auth.currentSession();
            console.log('App .session )= ', session);
            setIsAuthenticated(true);
            // alert(`i'm authenticated`);
        } catch (Error) {
            alert(`hello, redirecting to ${config.cognito.DOMAIN}/login?client_id=${config.cognito.APP_CLIENT_ID}&response_type=code&scope=email+openid+phone+profile&redirect_uri=${config.cognito.REDIRECT_URI}`);
            // window.location = `${config.cognito.DOMAIN}/login?client_id=${config.cognito.APP_CLIENT_ID}&response_type=code&scope=email+openid+phone+profile&redirect_uri=${config.cognito.REDIRECT_URI}`;
        }
    };

    useEffect(() => {
        checkAuth();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <h1>...</h1>;
    }
    return (
        <div>
            <AmplifyAuthenticator usernameAlias="email">
                <div slot="sign-up" style={{ textAlign: 'center' }}>
                    {/**
                 <AmplifySignUp
                 slot="sign-up"
                 usernameAlias="email"
                 formFields={[
                    {
                        type: "email",
                        label: "Email Address *",
                        placeholder: "Enter your email address",
                        required: true,
                    },
                    {
                        type: "password",
                        label: "Password *",
                        placeholder: "Enter your password",
                        required: true,
                    }
                ]}
                 />
                 * */}
                </div>

                <div slot="confirm-sign-in" style={{ textAlign: 'center' }}>
                    {/**    <AmplifyConfirmSignIn headerText="Confirm Sign in" slot="confirm-sign-in"></AmplifyConfirmSignIn>* */}
                </div>
                <div slot="confirm-sign-up" style={{ textAlign: 'center' }}>
                    {/** <AmplifyConfirmSignUp headerText="Confirm Sign up" slot="confirm-sign-up"></AmplifyConfirmSignUp>* */}
                </div>
                <div slot="verify-contact" style={{ textAlign: 'center' }}>
                    {/** <AmplifyVerifyContact slot="verify-contact"/>* */}
                </div>
                <div slot="sign-in" style={{ textAlign: 'center' }}>
                    {/** <AmplifySignIn slot="sign-in" usernameAlias="email" />* */}
                </div>
                <div>
                    <GlobalStyles />
                    <Router>
                        <Layout />
                    </Router>
                </div>
            </AmplifyAuthenticator>

        </div>
    );
};


const X = (props) => {


};

export default App;
