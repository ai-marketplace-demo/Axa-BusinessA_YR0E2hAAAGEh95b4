import { gql } from "apollo-boost";

const browseSqlPipelineRepository= (input)=>{
    return {
        variables:{
            input:input,
        },
        query:gql`
            query BrowseSqlPipelineRepository($input:SqlPipelineBrowseInput!){
                browseSqlPipelineRepository(input:$input)
            }
        `
    }
}


export default browseSqlPipelineRepository ;
