import { gql } from "apollo-boost";

const getSqlPipelineFileContent= (input)=>{
    return {
        variables:{
            input:input,
        },
        query:gql`
            query getSqlPipelineFileContent($input:SqlPipelineFileContentInput!){
                getSqlPipelineFileContent(input:$input)
            }
        `
    }
}


export default getSqlPipelineFileContent ;
