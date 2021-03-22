import { gql } from "apollo-boost";

const createCategory=({input,parentUri})=>{
    return {
        variables:{
            input  : input,
            parentUri:parentUri
        },
        mutation :gql`mutation CreateCategory($parentUri:String!,$input:CreateCategoryInput){
            createCategory(parentUri:$parentUri, input:$input){
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


export default createCategory;
