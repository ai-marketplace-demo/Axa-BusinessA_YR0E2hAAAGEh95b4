import { gql } from "apollo-boost";

const getProject= (projectUri)=>{
    return {
        variables:{
            projectUri:projectUri
        },
        query:gql`
            query GetProject($projectUri:String!){
                getProject(projectUri:$projectUri){
                        projectUri
                        owner
                        description
                        label
                        created
                        region
                        tags
                        owner
                        userRoleInProject
                        userRoleInEnvironment
                        S3BucketName
                        GlueDatabaseName
                        IAMRoleName
                        organization{
                            organizationUri
                        }
                        environment{
                            AwsAccountId
                            label
                            environmentUri
                            SamlGroupName
                            region
                        }
                    }
                }
        `
    }
}


export default getProject ;
