import React from 'react';
import {
    Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings
} from 'aws-amplify-react';

const App = () => (
    <Authenticator hideDefault>
        <h1> hello</h1>
    </Authenticator>
);


export default App;
