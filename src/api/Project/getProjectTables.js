import { gql } from "apollo-boost";

const listProjectTables= ({projectUri,filter})=>{
    return {
        variables:{
            projectUri:projectUri,
            filter:filter
        },
        query:gql`
            query ListProjectTables($projectUri:String!,$filter:DatasetTableFilter){
                listProjectTables(projectUri:$projectUri,filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        tableUri
                        projectPermission
                        GlueDatabaseName
                        GlueTableName
                        dataset{
                            name
                            datasetUri
                        }
                    }
                }
            }
        `
    }
}


export default listProjectTables ;
