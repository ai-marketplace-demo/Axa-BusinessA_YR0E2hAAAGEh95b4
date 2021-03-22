import { gql } from "apollo-boost";

const deleteAirflowProject=({ projectUri })=>{
    return {
        variables:{projectUri},
        mutation :gql`mutation deleteAirflowProject(
            $projectUri:String
        ){
            deleteAirflowProject(
                projectUri:$projectUri
            )
        }`
    }
}


export default deleteAirflowProject;
