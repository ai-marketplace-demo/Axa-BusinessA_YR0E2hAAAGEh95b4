import React, {useState,useEffect} from "react";
import config from '../config';
import { ApolloClient, ApolloLink, InMemoryCache,HttpLink } from 'apollo-boost';
import { Auth } from 'aws-amplify';
import useToken from "./token";

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
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
    }
};


const useClient=()=>{
    let [client, setClient] = useState(null);
    const token = useToken();

    const initClient= async()=>{
        console.log("token = ", token);
        const t = token;
        const httpLink = new HttpLink({
            uri: config.apiGateway.URL,
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
  
                }
            });
            return forward(operation);
        });
        const client = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache(),
            defaultOptions:defaultOptions

        });
        setClient(client);
    };



    useEffect(()=> {
        if (token){
            initClient();
        }
    },[token]);
    return client;
};

export default useClient;
