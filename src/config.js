

const conf = {
    s3: {
        REGION: "eu-west-1",
        BUCKET: "datahubui"
    },
    apiGateway: {
        REGION: "eu-west-1",
        //URL:"https://gd1waa6w3c.execute-api.eu-west-1.amazonaws.com/prod/graphql", //shahzad
        //URL: "https://127.0.0.1:3000/graphql", // local dev https

        URL: "https://localhost:3000/graphql", // local dev https
        ESURL: "https://localhost:3000/esproxy", // local dev https

        //URL: "https://w5zclcf40g.execute-api.eu-west-1.amazonaws.com/prod/graphql/api", // my deployment
        //ESURL: "https://w5zclcf40g.execute-api.eu-west-1.amazonaws.com/prod/search/api", // my deployment
    },
    cognito: {
        REGION: "eu-west-1",
        //USER_POOL_ID: "eu-west-1_4spESIOA9",
        USER_POOL_ID: "eu-west-1_m8e6mCxg7",
        //APP_CLIENT_ID: "7jf95n32cbq6j05riqb103c7r3",
        APP_CLIENT_ID: "6j30ebrc7s0mqd2hbhonpsr28o",
        //DOMAIN:"https://datahubuserpoollocalmoshir.auth.eu-west-1.amazoncognito.com",
        DOMAIN:"https://datahub294920712041eu-west-1.auth.eu-west-1.amazoncognito.com",
        REDIRECT_URI : 'https://d1jztuqy7k8jkn.cloudfront.net', // my deployment
        //REDIRECT_URI : 'https://127.0.0.1',
        SIGNOUT_URL: 'https://www.example.com',
        TYPE:"token",
        SCOPE:['email','phone','openid','profile']
    }

};

export default {
    ...conf,
};
