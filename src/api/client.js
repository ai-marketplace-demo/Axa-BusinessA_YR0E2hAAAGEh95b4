import React, {useState,useEffect} from "react";
import config from '../config';
import { ApolloClient, ApolloLink, InMemoryCache,HttpLink } from 'apollo-boost';
import { Auth } from 'aws-amplify';

const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
    mutate: {
        errorPolicy: 'all'
    }
};

const useClient=()=>{
    let [client, setClient] = useState(null);
    let [token, setToken] = useState();

    const fetchAuthToken = async()=>{
        if (!token){
            let session = await Auth.currentSession();
            const t = await session.getIdToken().getJwtToken();
            console.log("got token", t);
            const httpLink = new HttpLink({
                uri: "https://localhost:5000/graphql",
            });
            const authLink = new ApolloLink((operation, forward) => {
                operation.setContext({
                    headers: {
                        AccessControlAllowOrigin: '*',
                        AccessControlAllowHeaders: '*',
                        'access-control-allow-origin': '*',
                        Authorization: t ? `${t}` : "",
                        AccessKeyId: 'none',
                        SecretKey: 'none',
                        username: 'jeff', //this is for local development only
                        groups: 'a,n' //this is for local development only
                    }
                });
                return forward(operation);
            });
            const client = new ApolloClient({
                link: authLink.concat(httpLink),
                cache: new InMemoryCache(),
                defaultOptions:defaultOptions

            });
            setToken(t);
            setClient(client);
            console.log(client);
        }
    };
    useEffect(()=> {
        if (!token){
            fetchAuthToken();

        }
    },[fetchAuthToken, token]);
    return client;
};

export default useClient;
