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
                        AwsAccountId
                        S3BucketName
                        GlueDatabaseName
                        tags
                        businessOwnerEmail
                        IAMDatasetAdminRoleArn                        
                        businessOwnerDelegationEmails
                        stack{
                            stackid
                            status
                            link
                            
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
                        environment{
                            environmentUri
                            label
                        }
                        quality
                    }
                }
        `
    }
}


export default getDataset ;
