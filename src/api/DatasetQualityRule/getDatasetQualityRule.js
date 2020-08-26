import { gql } from "apollo-boost";

const getDatasetQualityRule= (ruleUri)=>{
    return {
        variables:{
            ruleUri
        },
        query:gql`
            query GetDatasetQualityRule($ruleUri:String!){
                getDatasetQualityRule(ruleUri:$ruleUri){
                    ruleUri
                    name
                    label
                    description
                    created
                    query
                }
            }
        `
    }
}


export default getDatasetQualityRule ;
