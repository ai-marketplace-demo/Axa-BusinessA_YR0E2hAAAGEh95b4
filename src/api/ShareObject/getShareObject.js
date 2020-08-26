import { gql } from "apollo-boost";

const getShareObject=({shareUri, filter})=>{
    return {
        variables:{
            shareUri:shareUri,
            filter:filter
        },
        query :gql`query getShareObject($shareUri:String!,$filter:ShareableObjectFilter){
            getShareObject(shareUri:$shareUri){
                shareUri
                created
                owner
                status
                userRoleForShareObject
                #label
                #deleted
                #confirmed
                #userInitiated
                principal{
                    principalId
                    principalType
                    principalName
                    AwsAccountId
                    region
                    SamlGroupName
                    organizationName
                }
                items(filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        itemUri
                        shareItemUri
                        itemType
                        itemName
                        status
                    }
                }

            }
        }`
    }
}


export default getShareObject;
