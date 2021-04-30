import { gql } from "apollo-boost";

const listClusterDatasetTables= ({clusterUri,filter})=>{
    return {
        variables:{
            clusterUri:clusterUri,
            filter:filter,
            //schema(clusterUri:$clusterUri)
        },
        query:gql`
            query listRedshiftClusterCopyEnabledTables($clusterUri:String!,$filter:DatasetTableFilter){
                listRedshiftClusterCopyEnabledTables(clusterUri:$clusterUri,filter:$filter){
                        count
                        page
                        pages
                        hasNext
                        hasPrevious
                        count
                        nodes{
                            datasetUri
                            tableUri
                            name
                            label
                            GlueDatabaseName
                            GlueTableName
                            S3Prefix
                            AwsAccountId
                            
                        }
                }
            }
        `
    }
}


export default listClusterDatasetTables;
