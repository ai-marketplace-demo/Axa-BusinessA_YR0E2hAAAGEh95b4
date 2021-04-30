import { gql } from "apollo-boost";

const listAvailableDatasetTables= ({clusterUri,filter})=>{
    return {
        variables:{
            clusterUri:clusterUri,
            filter:filter
        },
        query:gql`
            query listRedshiftClusterAvailableDatasetTables($clusterUri:String!,$filter:DatasetTableFilter){
                listRedshiftClusterAvailableDatasetTables(clusterUri:$clusterUri,filter:$filter){
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
                    }
                }
            }
        `
    }
};


export default listAvailableDatasetTables;
