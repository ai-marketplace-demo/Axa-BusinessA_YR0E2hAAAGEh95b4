

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

    },
    cognito: {
        REGION: "eu-west-1",
        //USER_POOL_ID: "eu-west-1_U3PjTzEct", //mine
        USER_POOL_ID: "eu-west-1_wjo8MipZb", //mine
        //USER_POOL_ID: "eu-west-1_s79fS8VHm",//shahzad


        APP_CLIENT_ID: "3og3gcrtv1rnu6396600oveh4b", //mine
        //APP_CLIENT_ID: "3vidp4ftv0h3iguthgudmighh8", //shahzad

        DOMAIN:"https://dhdomaintest.auth.eu-west-1.amazoncognito.com",// mine
        //DOMAIN:"https://datahub3vidp4ftv0h3iguthgudmighh8.auth.eu-west-1.amazoncognito.com",// shahzad


        //REDIRECT_URI : 'http://localhost:1234/',
        REDIRECT_URI : 'https://127.0.0.1:1234',
        //REDIRECT_URI   : 'https://datahub.com:1234/',
        //REDIRECT_URI : 'https://d3maw90xp7pgil.cloudfront.net',
        SIGNOUT_URL: 'https://www.example.com',
        //IDENTITY_POOL_ID: "eu-west-1:b23949f9-be68-4a20-bc31-b6c93d1fdf04",
        TYPE:"token",
        SCOPE:['email','openid','profile']
    }

};

export default {
    ...conf,
};
