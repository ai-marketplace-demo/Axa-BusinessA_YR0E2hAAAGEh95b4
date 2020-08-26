import React from "react";
import {
    AmplifyAuthenticator,
    AmplifySignUp,
    AmplifySignIn,
    AmplifyConfirmSignIn,
    AmplifyVerifyContact,
    AmplifyConfirmSignUp
} from '@aws-amplify/ui-react';
import config from './config';
import Amplify from 'aws-amplify';
import {BrowserRouter as Router, Route} from "react-router-dom";
import { createGlobalStyle } from 'styled-components';
import Layout from "./components/Layout/Layout";
require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/js/bootstrap.min");


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
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    API: {
        endpoints: [
            {
                name: "datahub",
                endpoint: config.apiGateway.URL,
                region: config.apiGateway.REGION
            },
        ]
    }
});


const App=(props)=> {
    return <AmplifyAuthenticator usernameAlias="email">
        <div slot="sign-up" style={{ textAlign: 'center' }}>
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
        </div>
        <div slot="confirm-sign-in" style={{ textAlign: 'center' }}>
            <AmplifyConfirmSignIn headerText="Confirm Sign in" slot="confirm-sign-in"></AmplifyConfirmSignIn>
        </div>
        <div slot="confirm-sign-up" style={{ textAlign: 'center' }}>
            <AmplifyConfirmSignUp headerText="Confirm Sign up" slot="confirm-sign-up"></AmplifyConfirmSignUp>
        </div>
        <div slot="verify-contact" style={{ textAlign: 'center' }}>
            <AmplifyVerifyContact slot="verify-contact"/>
        </div>
        <div slot="sign-in" style={{ textAlign: 'center' }}>
            <AmplifySignIn slot="sign-in" usernameAlias="email" />
        </div>
        <div>
            <GlobalStyles/>
            <Router>
                <Layout/>
            </Router>
        </div>
    </AmplifyAuthenticator>
};


export default App;
