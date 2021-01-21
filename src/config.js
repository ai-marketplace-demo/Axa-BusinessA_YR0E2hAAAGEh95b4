

const conf = {
    s3: {
        REGION: "eu-west-1",
        BUCKET: "cloudfrontwafdev-dh-datah-cftdistrobucket2ef8083f-1ur7qsbfs6435"
    },
    apiGateway: {
        REGION: "eu-west-1",

        URL: " https://lmc1x2k4ue.execute-api.eu-west-1.amazonaws.com/prod/graphql/api", // local dev https
        ESURL: " https://lmc1x2k4ue.execute-api.eu-west-1.amazonaws.com/prod/graphql/api", // local dev https

        //URL: "https://iqqb86uk6l.execute-api.eu-west-1.amazonaws.com/prod/graphql/api", // 950130011294
        //ESURL: "https://iqqb86uk6l.execute-api.eu-west-1.amazonaws.com/prod/search/api", // 950130011294
    },
    cognito: {
        REGION: "eu-west-1",

        //USER_POOL_ID: "eu-west-1_ovuLWv48G",//950130011294
        //APP_CLIENT_ID: "1s0bibvbbdcb1mb3qbq9afu9ti",//950130011294
        //DOMAIN:"https://datahubdeveuwest1950130011294.auth.eu-west-1.amazoncognito.com", //950130011294
        //REDIRECT_URI : 'https://d26bwgcp8nv25z.cloudfront.net', // my deployment

        USER_POOL_ID: "eu-west-1_u2i6wjYQH",
        APP_CLIENT_ID: "7hibugnidkcp8d85e9b3qf3pa7",
        DOMAIN:"https://datahubdeveuwest1532999248425.auth.eu-west-1.amazoncognito.com",
        REDIRECT_URI : 'https://d2t6tnbw7z21bz.cloudfront.net',
        SIGNOUT_URL: 'https://www.example.com',
        TYPE:"token",
        SCOPE:['email','phone','openid','profile']
    }

};

export default {
    ...conf,
};
