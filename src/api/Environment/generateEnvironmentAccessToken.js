import { gql } from "apollo-boost";

const generateEnvironmentAccessToken = ({environmentUri})=>{
    return {
        variables:{
            environmentUri: environmentUri
        },
        query:gql`
            query GenerateEnvironmentAccessToken($environmentUri:String){
                generateEnvironmentAccessToken(environmentUri:$environmentUri)
            }
        `
    }
}


export default generateEnvironmentAccessToken ;
