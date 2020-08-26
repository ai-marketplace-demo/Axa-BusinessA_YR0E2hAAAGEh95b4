import { gql } from "apollo-boost";

const previewTable= ({tableUri,queryExecutionId})=>{
    return {
        variables:{
            tableUri:tableUri,
            queryExecutionId : queryExecutionId
        },
        query:gql`
            query PreviewTable($tableUri:String!,$queryExecutionId:String){
                previewTable(tableUri:$tableUri,queryExecutionId:$queryExecutionId){
                        count
                        status
                        queryExecutionId
                        nodes{
                            data
                        }
                    }
                }
        `
    }
}


export default previewTable ;
