import './App.less';
import {Layout} from "./components/layout";
import React from 'react';

import GlobalStyle from './globalStyles';
import Router from "./Router";
import {BrowserRouter} from "react-router-dom";
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import config from "./config";
import 'antd/dist/antd.css';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  }
})

function App() {
  return         <AmplifyAuthenticator>
    <BrowserRouter>
    <GlobalStyle />
    <Layout>
      <Router/>
    </Layout>
  </BrowserRouter>
  </AmplifyAuthenticator>
}

export default App;
