import { gql } from "apollo-boost";

const updateTerm=({input,nodeUri})=>{
    return {
        variables:{
            input  : input,
            nodeUri:nodeUri
        },
        mutation :gql`mutation UpdateTerm($nodeUri:String!,$input:UpdateTermInput){
            updateTerm(nodeUri:$nodeUri, input:$input){
                nodeUri
                label
                path
                readme
                created
                owner
            }
        }`
    }
}


export default updateTerm;
