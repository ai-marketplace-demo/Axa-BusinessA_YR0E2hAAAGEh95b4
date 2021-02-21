import { gql } from "apollo-boost";

const previewTable2= (tableUri)=>{
    return {
        variables:{
            tableUri:tableUri,
        },
        query:gql`
            query PreviewTable2($tableUri:String!){
                previewTable2(tableUri:$tableUri){
                    fields
                    rows
                }
            }
        `
    }
}


export default previewTable2 ;
