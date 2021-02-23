import { gql } from 'apollo-boost';

const getDashboard = (dashboardUri) => ({
    variables: {
        dashboardUri,
    },
    query: gql`
            query GetDashboard($dashboardUri:String!){
                getDashboard(dashboardUri:$dashboardUri){
                    dashboardUri
                    name
                    owner
                    SamlGroupName
                    description
                    label
                    created
                    tags
                    userRoleForDashboard
                    organization{
                        organizationUri
                        label
                        name
                    }
                    environment{
                            environmentUri
                            name
                            label
                            AwsAccountId
                            region
                        }
                }
            }
        `
});


export default getDashboard;
