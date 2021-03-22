import { gql } from "apollo-boost";

const syncDatasetTableColumns= (tableUri)=>{
    return {
        variables:{
            tableUri:tableUri,
        },
        mutation:gql`
            mutation SyncDatasetTableColumns($tableUri:String!){
                syncDatasetTableColumns(tableUri:$tableUri){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        columnUri
                        name
                        description
                        typeName
                    }
                }
            }
        `
    }
}


export default syncDatasetTableColumns ;
