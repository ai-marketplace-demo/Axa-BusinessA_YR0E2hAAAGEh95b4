import { gql } from "apollo-boost";

const createGlossary=(input)=>{
    return {
        variables:{
            input  : input
        },
        mutation :gql`mutation CreateGlossary($input:CreateGlossaryInput){
            createGlossary(input:$input){
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


export default createGlossary;
