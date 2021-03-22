import { gql } from "apollo-boost";

const listProjectLocations= ({projectUri,filter})=>{
    return {
        variables:{
            projectUri:projectUri,
            filter:filter
        },
        query:gql`
            query ListProjectStorageLocations($projectUri:String!,$filter:DatasetStorageLocationFilter){
                listProjectStorageLocations(projectUri:$projectUri,filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        locationUri
                        name
                        projectPermission
                        environmentEndPoint
                        S3BucketName
                        S3Prefix
                        dataset{
                            name
                        }
                        
                    }
                }
            }
        `
    }
}


export default listProjectLocations ;
