import { gql } from "apollo-boost";

const listDatasetTables= ({datasetUri,filter})=>{
    return {
        variables:{
            datasetUri:datasetUri,
            filter:filter
        },
        query:gql`
            query GetDataset($datasetUri:String!,$filter:DatasetTableFilter){
                getDataset(datasetUri:$datasetUri){
                        datasetUri
                        tables(filter:$filter){
                            count
                            page
                            pages
                            hasNext
                            hasPrevious
                            nodes{
                                dataset{
                                    datasetUri
                                }
                                tableUri
                                created
                                GlueTableName
                                description
                                userRoleForTable
                            }
                        }
           
                    }
                }
        `
    }
}


export default listDatasetTables ;
