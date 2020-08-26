import { gql } from "apollo-boost";

const searchDashboards= (filter)=>{
    return {
        variables:{
            filter:filter,
        },
        query:gql`
            query searchDashboards($filter:DashboardFilter){
                searchDashboards(filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
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
            }
        `
    }
}


export default searchDashboards ;
