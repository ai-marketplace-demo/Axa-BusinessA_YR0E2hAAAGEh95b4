import { gql } from "apollo-boost";

const archiveEnvironment=({environmentUri})=>{
    return {
        variables:{
            environmentUri:environmentUri
        },
        mutation :gql`mutation ArchiveEnv($environmentUri:String!){
            archiveEnvironment(environmentUri:$environmentUri)
        }`
    }
}


export default archiveEnvironment;
