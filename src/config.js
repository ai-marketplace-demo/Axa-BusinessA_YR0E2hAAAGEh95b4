

const conf = {
    s3: {
        REGION: "eu-west-1",
        BUCKET: "cloudfrontwafdev-dh-datah-cftdistrobucket2ef8083f-1ljvtmftvzv9f"
    },
    apiGateway: {
        REGION: "eu-west-1",

        URL: "https://localhost:3000/graphql", // local dev https
        ESURL: "https://localhost:3000/esproxy", // local dev https

        //URL: "https://iqqb86uk6l.execute-api.eu-west-1.amazonaws.com/prod/graphql/api", // 950130011294
        //ESURL: "https://iqqb86uk6l.execute-api.eu-west-1.amazonaws.com/prod/search/api", // 950130011294
    },
    cognito: {
        REGION: "eu-west-1",

        //USER_POOL_ID: "eu-west-1_ovuLWv48G",//950130011294
        //APP_CLIENT_ID: "1s0bibvbbdcb1mb3qbq9afu9ti",//950130011294
        //DOMAIN:"https://datahubdeveuwest1950130011294.auth.eu-west-1.amazoncognito.com", //950130011294
        //REDIRECT_URI : 'https://d26bwgcp8nv25z.cloudfront.net', // my deployment

        USER_POOL_ID: "eu-west-1_m8e6mCxg7",
        APP_CLIENT_ID: "6j30ebrc7s0mqd2hbhonpsr28o",
        DOMAIN:"https://datahub294920712041eu-west-1.auth.eu-west-1.amazoncognito.com",
        REDIRECT_URI : 'https://127.0.0.1',

        SIGNOUT_URL: 'https://www.example.com',
        TYPE:"token",
        SCOPE:['email','phone','openid','profile']
    }

};

export default {
    ...conf,
};
