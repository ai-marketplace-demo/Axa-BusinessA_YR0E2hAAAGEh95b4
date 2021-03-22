const config = {
    apiGateway: {
        REGION: "eu-west-1",
        URL: "https://YOUR_APIG_ENDPOINT/prod/graphql/api",
        ESURL: "https://YOUR_APIG_ENDPOINT/prod/search/api",

    },
    cognito: {
        REGION: "YOUR_COGNITO_REGION",
        USER_POOL_ID: "YOUR_COGNITO_USERPOOL_ID",
        APP_CLIENT_ID: "YOUR_COGNITO_APP_CLIENT_ID",
        DOMAIN: "YOUR_COGNITO_DOMAIN",
        REDIRECT_URI: "YOUR_DATAHUB_FRONTEND_CLOUDFRONT_ENDPOINT",
        SIGNOUT_URL: "YOUR_DATAHUB_FRONTEND_CLOUDFRONT_ENDPOINT",
        TYPE:"token",
        SCOPE:['email','phone','openid','profile']
    }

};
export default {
    ...config,
};
