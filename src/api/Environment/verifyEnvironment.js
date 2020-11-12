import { gql } from "apollo-boost";

const checkEnvironment = (input)=>{
    return {
        variables:{
            input: input
        },
        query:gql`
            query CheckEnvironment($input:AwsEnvironmentInput!){
                checkEnvironment(input:$input)
            }
        `
    }
}


export default checkEnvironment ;
