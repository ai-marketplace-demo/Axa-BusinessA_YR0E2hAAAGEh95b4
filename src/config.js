const config = {
    apiGateway: {
        REGION: "eu-west-1",
        URL: "https://s7k8tywqkg.execute-api.eu-west-1.amazonaws.com/prod/graphql/api",
        ESURL: "https://s7k8tywqkg.execute-api.eu-west-1.amazonaws.com/prod/search/api",

    },
    cognito: {
        REGION: "eu-west-1",
        USER_POOL_ID: "eu-west-1_LHoa6avN8",
        APP_CLIENT_ID: "64gelst471fo13e6kt0dvh608s",
        DOMAIN: "datahubdeveuwest1247527965786.auth.eu-west-1.amazoncognito.com",
        REDIRECT_URI: "https://d3nl47xd9uol60.cloudfront.net",
        //REDIRECT_URI: "https://localhost:8080",
        SIGNOUT_URL: "https://d3nl47xd9uol60.cloudfront.net",
        TYPE:"token",
        SCOPE:['email','phone','openid','profile']
    }

};
export default {
    ...config,
};
