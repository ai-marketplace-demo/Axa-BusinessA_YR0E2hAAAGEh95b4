import React , {useEffect, useState} from "react";
import Amplify, { Auth } from 'aws-amplify';
import config from './config';
import { AmplifyAuthenticator, withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import {BrowserRouter as Router} from "react-router-dom";
import Layout from "./components/Layout/Layout3";
import {createGlobalStyle} from "styled-components";
import {Container, Row, Col, Dropdown} from "react-bootstrap";
import styled from "styled-components";
import 'react-toastify/dist/ReactToastify.css';
require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/js/bootstrap.min");
require("bootswatch/dist/lux/bootstrap.css");
require('loaders.css/loaders.css')

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
        //identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID
    }
})


const App = (props)=>{
    return <div>
        <AmplifyAuthenticator>
            <Router>
                <Layout/>
            </Router>
    </AmplifyAuthenticator>
        <GlobalStyles/>
    </div>
}

//export default withAuthenticator(App,{theme : MyTheme});
export default App; //withAuthenticator(App);
