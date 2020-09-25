let conf;

switch (process.env.REACT_APP_STAGE) {
    case 'mushhz':
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
    case 'staging':
        conf = {
            s3: {
                REGION: "eu-west-1",
                BUCKET: "datahubui"
            },
            apiGateway: {
                REGION: "eu-west-1",
                URL: "https://4hwnbgwouh.execute-api.eu-west-1.amazonaws.com/staging/graphql"
            },
            okta: {
                clientId: "0oa9zx25cet7I8Wri4x6",
                redirectUri: 'https://d2fmx1qp49kxm7.cloudfront.net/implicit/callback',
                issuer: "https://dev-163178.okta.com/oauth2/default"
            },
            cognito: {
                REGION: "eu-west-1",
                USER_POOL_ID: "eu-west-1_mQgehOVwD",
                APP_CLIENT_ID: "347am4v04dsunlfgq6rfs7gdv5",
                IDENTITY_POOL_ID: "eu-west-1:5f9569aa-8a5a-4f25-ac9d-ae874fe57eac"
            }
        };
        break;
    case 'alaccount':
        conf = {
            s3: {
                REGION: "eu-west-1",
                BUCKET: "datahubui"
            },
            apiGateway: {
                REGION: "eu-west-1",
                URL: "https://wlmc0abdce.execute-api.eu-west-1.amazonaws.com/prod/graphql"
            },
            okta: {
                clientId: "0oa9zx25cet7I8Wri4x6",
                redirectUri: 'https://d2fmx1qp49kxm7.cloudfront.net/implicit/callback',
                issuer: "https://dev-163178.okta.com/oauth2/default"
            },
            cognito: {
                REGION: "eu-west-1",
                USER_POOL_ID: "eu-west-1_cB0ZPx3Fx",
                APP_CLIENT_ID: "42tn7qtdbe5ois0rtscm9n0pd6",
                IDENTITY_POOL_ID: "eu-west-1:7e3c335d-1b84-41c6-a358-c2e47a6cdb5d"
            }
        };
        break;
    case 'prod':
        conf = {
            s3: {
                REGION: "eu-west-1",
                BUCKET: "datahubui"
            },
            apiGateway: {
                REGION: "eu-west-1",
                URL: "https://9va957cneb.execute-api.eu-west-1.amazonaws.com/prod/graphql"
            },
            okta: {
                clientId: "0oa9zx25cet7I8Wri4x6",
                redirectUri: 'https://d2llxvgfwo6cnm.cloudfront.net/implicit/callback',
                issuer: "https://dev-163178.okta.com/oauth2/default"
            },
            cognito: {
                REGION: "eu-west-1",
                USER_POOL_ID: "eu-west-1_Hk49IAdLO",
                APP_CLIENT_ID: "5tbl0fprlplqlj069nopvg6pk3",
                IDENTITY_POOL_ID: "eu-west-1:f6ee6f47-69f6-4bc8-a356-fd7efd0e55be"
            }
        };
        break;
    case 'dev':
    default:
        conf = {
            s3: {
                REGION: "eu-west-1",
                BUCKET: "datahubui"
            },
            apiGateway: {
                REGION: "eu-west-1",
                //URL:"https://gd1waa6w3c.execute-api.eu-west-1.amazonaws.com/prod/graphql",
                URL: "https://127.0.0.1:3000/graphql", // local dev https
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


                REDIRECT_URI : 'https://localhost:1234/',
                //REDIRECT_URI : 'https://127.0.0.1:1234/',
                SIGNOUT_URL: 'https://www.example.com',
                //IDENTITY_POOL_ID: "eu-west-1:b23949f9-be68-4a20-bc31-b6c93d1fdf04",
                TYPE:"token",
                SCOPE:['email','openid','profile']
            },
            // moussam
            moussamcognito: {
                REGION: "eu-west-1",
                USER_POOL_ID: "eu-west-1_glMh7FqnQ",
                APP_CLIENT_ID: "5hah0a406po3rrkqfi18a08d8r",
                IDENTITY_POOL_ID: "eu-west-1:7004ee25-c549-4028-9f26-e9313d909384"
            },

        };
        break;
}


export default {
    ...conf,
};
