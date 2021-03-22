import { gql } from "apollo-boost";

const requestLink=({nodeUri,targetUri, targetType})=>{
    return {
        variables:{
            nodeUri:nodeUri,
            targetType: targetType,
            targetUri:targetUri
        },
        mutation :gql`mutation RequestLink($nodeUri:String!,$targetUri:String!,$targetType:String!){
            requestLink(nodeUri:$nodeUri, targetUri:$targetUri,targetType:$targetType){
                linkUri
                created
            }
        }`
    }
}


export default requestLink;
