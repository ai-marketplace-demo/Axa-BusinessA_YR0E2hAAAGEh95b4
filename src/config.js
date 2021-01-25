const conf = {
    s3: {
        REGION: "eu-west-1",
        BUCKET: "cloudfrontwafdev-dh-datah-cftdistrobucket2ef8083f-1ur7qsbfs6435"
    },
    apiGateway: {
        REGION: "eu-west-1",
        URL: " https://lmc1x2k4ue.execute-api.eu-west-1.amazonaws.com/prod/graphql/api",
        ESURL: " https://lmc1x2k4ue.execute-api.eu-west-1.amazonaws.com/prod/search/api",

    },
    cognito: {
        REGION: "eu-west-1",
        USER_POOL_ID: "eu-west-1_u2i6wjYQH",
        APP_CLIENT_ID: "7hibugnidkcp8d85e9b3qf3pa7",
        DOMAIN: "https://datahubdeveuwest1532999248425.auth.eu-west-1.amazoncognito.com",
        DOMAIN_AMPLIFY: "datahubdeveuwest1532999248425.auth.eu-west-1.amazoncognito.com",
        REDIRECT_URI: 'https://datahub.haramine.people.aws.dev',
        // REDIRECT_URI: 'https://127.0.0.1:8080',
        SIGNOUT_URL: 'https://datahub.haramine.people.aws.dev',
        // SIGNOUT_URL: 'https://127.0.0.1:8080',
        TYPE: "token",
        SCOPE: ['email', 'phone', 'openid', 'profile']
    }

};

export default {
    ...conf,
};
