import { gql } from "apollo-boost";

const searchSqlPipelines= (filter)=>{
    return {
        variables:{
            filter:filter,
        },
        query:gql`
            query ListSqlPipelines($filter:SqlPipelineFilter){
                listSqlPipelines(filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        sqlPipelineUri
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


export default searchSqlPipelines ;
