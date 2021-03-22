import { gql } from "apollo-boost";

const getDataset= (datasetUri)=>{
    return {
        variables:{
            datasetUri:datasetUri
        },
        query:gql`
            query GetDataset($datasetUri:String!){
                getDataset(datasetUri:$datasetUri){
                        datasetUri
                        owner
                        description
                        label
                        name
                        region
                        created
                        userRoleForDataset
                        SamlAdminGroupName
                        AwsAccountId
                        S3BucketName
                        GlueDatabaseName
                        tags
                        businessOwnerEmail
                        IAMDatasetAdminRoleArn                        
                        businessOwnerDelegationEmails
                        stack{
                            stack
                            status
                            stackUri
                            targetUri
                            accountid
                            region
                            stackid
                            link
                            outputs
                            resources
                            
                        }
                        customTags{
                            Id
                            Key
                            Value
                        }
                        topics
                        language
                        confidentiality
                        organization{
                            organizationUri
                            label
                        }
                        terms{
                            count
                            nodes{
                                __typename
                                ...on Term {
                                    nodeUri
                                    path
                                    label
                                }
                            }
                        }
                        environment{
                            environmentUri
                            label
                            region
                            organization{
                                organizationUri
                                label
                            }
                        }
                    }
                }
        `
    }
}


export default getDataset ;
