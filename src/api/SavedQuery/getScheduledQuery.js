import { gql } from "apollo-boost";

const getScheduledQuery = (scheduledQueryUri)=>{
    return {
        variables:{
            scheduledQueryUri:scheduledQueryUri,
        },
        query:gql`
            query GetScheduledQuery($scheduledQueryUri:String!){
                getScheduledQuery(scheduledQueryUri:$scheduledQueryUri){
                    scheduledQueryUri
                    name
                    label
                    description
                    owner
                    created
                    description
                    queries{
                        count 
                        page
                        pages
                        nodes{
                            savedQueryUri
                            sqlBody
                            description
                            label
                            queryOrder
                        }
                    }
                }
            }
        `
    }
}


export default getScheduledQuery ;
