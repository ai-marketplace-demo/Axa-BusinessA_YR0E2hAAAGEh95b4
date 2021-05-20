let config;

switch (process.env.REACT_APP_STAGE) {
    case 'dev':
        config = {
            apiGateway: {
                REGION: "eu-west-1",
                URL: "http://localhost:5000/graphql",
                ESURL: "http://localhost:5000/esproxy",

            },
            cognito: {
                REGION: "eu-west-1",
                USER_POOL_ID: "eu-west-1_LHoa6avN8",
                APP_CLIENT_ID: "6mub43r79g5iu3hm4gelj5i7e3",
                DOMAIN: "datahubgammaeuwest1532999248425.auth.eu-west-1.amazoncognito.com",
                REDIRECT_URI: "https://localhost:8080",
                SIGNOUT_URL: "https://datahub.haramine.people.aws.dev",
                TYPE: "token",
                SCOPE: ['email', 'phone', 'openid', 'profile']
            }
        };
        break;
    default:
        config = {
            apiGateway: {
                REGION: "eu-west-1",
                URL: "https://t19hgrgln7.execute-api.eu-west-1.amazonaws.com/prod/graphql/api",
                ESURL: "https://t19hgrgln7.execute-api.eu-west-1.amazonaws.com/prod/search/api",

            },
            cognito: {
                REGION: "eu-west-1",
                USER_POOL_ID: "eu-west-1_vrepgyCwt",
                APP_CLIENT_ID: "4jftaq13fv7o8bit9hd1fq77a8",
                DOMAIN: "datahubgammaeuwest1577276694827.auth.eu-west-1.amazoncognito.com",
                REDIRECT_URI: "https://d5y2safvf74bh.cloudfront.net",
                SIGNOUT_URL: "https://d5y2safvf74bh.cloudfront.net",
                TYPE: "token",
                SCOPE: ['email', 'phone', 'openid', 'profile']
            }
        };
        break;
}
export default {
    ...config,
};
