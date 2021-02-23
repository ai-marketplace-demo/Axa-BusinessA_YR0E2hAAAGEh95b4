import React, { useState, useEffect } from 'react';
import {
    ApolloClient, ApolloLink, InMemoryCache, HttpLink
} from 'apollo-boost';
import { Auth } from 'aws-amplify';
import config from '../config';

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

const useClient = () => {
    const [client, setClient] = useState(null);
    const [token, setToken] = useState();

    const fetchAuthToken = async () => {
        if (!token) {
            // let session = await Auth.currentSession();
            // const t = await session.getIdToken().getJwtToken();
            // console.log("got token", t);
            const t = localStorage.getItem(`datahub-token-${config.cognito.APP_CLIENT_ID}`);
            const httpLink = new HttpLink({
                uri: config.apiGateway.URL,
                // uri: 'http://localhost:5000/graphql'
            });
            const authLink = new ApolloLink((operation, forward) => {
                operation.setContext({
                    headers: {
                        AccessControlAllowOrigin: '*',
                        AccessControlAllowHeaders: '*',
                        'access-control-allow-origin': '*',
                        Authorization: t ? `${t}` : '',
                        AccessKeyId: 'none',
                        SecretKey: 'none',

                    }
                });
                return forward(operation);
            });
            const client = new ApolloClient({
                link: authLink.concat(httpLink),
                cache: new InMemoryCache(),
                defaultOptions

            });
            setToken(t);
            setClient(client);
        }
    };
    useEffect(() => {
        if (!token) {
            fetchAuthToken();
        }
    }, [token]);
    return client;
};

export default useClient;
