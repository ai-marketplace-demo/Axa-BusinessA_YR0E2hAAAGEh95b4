import { gql } from "apollo-boost";

const updateGlossary=({input,nodeUri})=>{
    return {
        variables:{
            input  : input,
            nodeUri:nodeUri
        },
        mutation :gql`mutation UpdateGlossary($nodeUri:String!,$input:UpdateGlossaryInput){
            updateGlossary(nodeUri:$nodeUri, input:$input){
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


export default updateGlossary;
