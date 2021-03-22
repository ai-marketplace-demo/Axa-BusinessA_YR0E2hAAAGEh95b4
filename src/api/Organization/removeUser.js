import { gql } from "apollo-boost";

const removeUser=({input})=>{
    return {
        variables:{
            input  : input
        },
        mutation :gql`mutation RemoveUser($input:RemoveOrganizationUserInput){
            removeUser(input:$input)
        }`
    }
}


export default removeUser;
