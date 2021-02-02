import { gql } from "apollo-boost";

const updateEnvironmentStack=({environmentUri})=>{
    return {
        variables:{environmentUri:environmentUri},
        mutation :gql`mutation updateEnvironmentStack(
            $environmentUri:String!
        ){
            updateEnvironmentStack(
                environmentUri:$environmentUri
            )
        }`
    }
}


export default updateEnvironmentStack;
