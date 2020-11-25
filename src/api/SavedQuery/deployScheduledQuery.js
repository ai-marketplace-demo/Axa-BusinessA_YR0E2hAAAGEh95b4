import { gql } from "apollo-boost";

const deployScheduledQuery = ({savedQueryUri, sqlBody})=>{
    return {
        variables:{
            savedQueryUri:savedQueryUri,
            //environmentUri: environmentUri,
            sqlBody : sqlBody
        },
        mutation:gql`
            mutation DeployScheduledQuery (
                $scheduledQueryUri:String!){
                deployScheduledQuery (
                    scheduledQueryUri:$scheduledQueryUri 
                )
            }
        `
    }
}


export default deployScheduledQuery ;
