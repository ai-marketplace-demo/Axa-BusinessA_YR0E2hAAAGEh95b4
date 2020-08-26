import { gql } from "apollo-boost";

const removeProjectTrustRelationShip =({trustUri})=>{
    return {
        variables:{trustUri},
        mutation :gql`mutation RemoveProjectTrustRelationShip(
            $trustUri:String
        ){
            removeProjectTrustRelationShip(
                trustUri:$trustUri,
            )
        }`
    }
}


export default removeProjectTrustRelationShip;
