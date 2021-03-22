import { gql } from "apollo-boost";

const listDatasetsCreatedInEnvironment = ({filter,environmentUri})=>{
    return {
        variables:{
            environmentUri: environmentUri,
            filter:filter
        },
        query:gql`
            query ListDatasetsCreatedInEnvironment($filter:DatasetFilter,$environmentUri:String){
                listDatasetsCreatedInEnvironment(environmentUri:$environmentUri,filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        datasetUri
                        label
                        AwsAccountId
                        region
                        GlueDatabaseName
                        name
                        S3BucketName
                        created
                        owner
                    }
                }
            }
        `
    }
}


export default listDatasetsCreatedInEnvironment ;
