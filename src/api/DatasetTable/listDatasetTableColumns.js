import { gql } from "apollo-boost";

const listDatasetTableColumns= ({tableUri,filter})=>{
    return {
        variables:{
            tableUri:tableUri,
            filter: filter
        },
        query:gql`
            query ListDatasetTableColumns($tableUri:String!,$filter:DatasetTableColumnFilter){
                listDatasetTableColumns(tableUri:$tableUri, filter:$filter){
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


export default listDatasetTableColumns ;
