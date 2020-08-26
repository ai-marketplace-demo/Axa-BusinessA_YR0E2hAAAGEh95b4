import { gql } from "apollo-boost";

const getDashboard= (dashboardUri)=>{
    return {
        variables:{
            dashboardUri:dashboardUri,
        },
        query:gql`
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
                    organization{
                        organizationUri
                        label
                        name
                    }
                }
            }
        `
    }
}


export default getDashboard ;
