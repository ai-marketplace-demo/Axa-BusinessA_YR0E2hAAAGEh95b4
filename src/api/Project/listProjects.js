import { gql } from "apollo-boost";

const listProjects= ({term,organization,roles})=>{
    return {
        variables:{
            filter:{organization:organization||'',term:term||'', roles:roles}
        },
        query:gql`
            query ListProjects($filter:ProjectFilter){
                listProjects(filter:$filter){
                        count
                        page
                        pages
                        hasNext
                        hasPrevious
                        nodes{
                            projectUri
                            name
                            owner
                            SamlGroupName
                            description
                            label
                            created
                            region
                            tags
                            owner
                            userRoleInProject
                            userRoleInEnvironment
                            stats{
                                contributors
                                datasets
                            }
                            organization{
                                organizationUri
                                label
                            }
                            environment {
                                AwsAccountId
                            }
                        }
                    }
                }
        `
    }
}


export default listProjects ;
