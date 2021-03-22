import { gql } from "apollo-boost";

const getDatasetSchema= ({datasetUri,filter})=>{
    return {
        variables:{
            datasetUri:datasetUri,
            filter:filter
        },
        query:gql`
            query GetDataset($datasetUri:String!,$filter:DatasetTableFilter){
                getDataset(datasetUri:$datasetUri){
                        tables(filter:$filter){
                            count
                            page
                            pages
                            hasNext
                            hasPrevious
                            nodes{
                                tableUri
                                created
                                GlueTableName
                                GlueDatabaseName
                                description
                                stage
                                userRoleForTable
                                columns{
                                    count
                                    page
                                    pages
                                    hasNext
                                    hasPrevious
                                    nodes{
                                        name
                                        columnUri
                                        label
                                        typeName
                                    }
                                }
                               
                            }
                        }
           
                    }
                }
        `
    }
}


export default getDatasetSchema ;
