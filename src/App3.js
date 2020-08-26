import React from "react" ;
import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings } from 'aws-amplify-react';
const App = ()=>{
    return <Authenticator hideDefault={true}>
            <h1> hello</h1>
        </Authenticator>

}


export default App;
