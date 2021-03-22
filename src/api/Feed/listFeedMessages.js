import { gql } from "apollo-boost";

const listFeedMessages = ({targetUri,targetType,filter})=>{
    return {
        variables:{
            targetUri: targetUri,
            targetType: targetType,
            filter:filter
        },
        query:gql`
            query GetFeed(
                $targetUri:String!,
                $targetType:String!,
                $filter:FeedMessageFilter
            ){
                getFeed(
                    targetUri:$targetUri,
                    targetType:$targetType
                ){
                    target{
                        __typename
                        ...on Worksheet{
                            label
                        }
                        ... on Dataset {
                            label
                        }

                    }
                    messages(filter:$filter){
                        count
                        hasNext
                        hasPrevious
                        page
                        pages
                        nodes{
                            content
                            feedMessageUri
                            creator
                            created
                        }
                    }

                }
            }
        `
    }
}


export default listFeedMessages;
