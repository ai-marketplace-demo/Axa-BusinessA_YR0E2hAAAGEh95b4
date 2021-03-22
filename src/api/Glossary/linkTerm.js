import { gql } from "apollo-boost";

const linkTerm=({nodeUri,targetUri, targetType})=>{
    return {
        variables:{
            nodeUri:nodeUri,
            targetType: targetType,
            targetUri:targetUri
        },
        mutation :gql`mutation LinkTerm($nodeUri:String!,$targetUri:String!,$targetType:String!){
            linkTerm(nodeUri:$nodeUri, targetUri:$targetUri,targetType:$targetType){
                linkUri
                created
            }
        }`
    }
}


export default linkTerm;
