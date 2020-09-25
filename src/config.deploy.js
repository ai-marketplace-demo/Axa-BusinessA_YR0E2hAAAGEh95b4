let conf;

conf = {
            s3: {
                REGION: "eu-west-1",
                BUCKET: "stage-dh-datahubcloudfron-cftdistrobucket2ef8083f-nzhg68gh388y"
            },
            apiGateway: {
                REGION: "eu-west-1",
                URL:"https://gd1waa6w3c.execute-api.eu-west-1.amazonaws.com/prod/graphql",
            },
            cognito: {
                REGION: "eu-west-1",
                USER_POOL_ID: "eu-west-1_s79fS8VHm",
                APP_CLIENT_ID: "3vidp4ftv0h3iguthgudmighh8",
                DOMAIN:"https://datahub3vidp4ftv0h3iguthgudmighh8.auth.eu-west-1.amazoncognito.com",// shahzad
                REDIRECT_URI : 'https://d3maw90xp7pgil.cloudfront.net/',
                SIGNOUT_URL: 'https://www.example.com',
                TYPE:"token",
                SCOPE:['email','openid','profile']
            },

        };


export default {
    ...conf,
};
