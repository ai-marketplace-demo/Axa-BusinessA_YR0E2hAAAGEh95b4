import { gql } from "apollo-boost";

const listAvailableDatasets= ({projectUri,filter})=>{
    return {
        variables:{
            projectUri:projectUri,
            filter:filter
        },
        query:gql`
            query ListAvailableDatasets($projectUri:String!,$filter:ProjectDatasetFilter){
                listAvailableDatasets(projectUri:$projectUri,filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        datasetUri
                        name
                        label
                        region
                        tags
                        userRoleForDataset
                        projectPermission(projectUri:$projectUri)
                        description
                        organization{
                            name
                            organizationUri
                            label
                        }
                        statistics{
                            tables
                            locations
                        }
                        environment{
                            environmentUri
                            name
                            AwsAccountId
                            SamlGroupName
                            region
                        }
                        
                    }
                }
            }
        `
    }
}


export default listAvailableDatasets ;
