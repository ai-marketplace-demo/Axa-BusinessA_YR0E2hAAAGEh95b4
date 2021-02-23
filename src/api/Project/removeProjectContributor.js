import { gql } from 'apollo-boost';

const removeProjectContributor = ({ userName, projectUri }) => ({
    variables: { userName, projectUri },
    mutation: gql`mutation RemoveProjectContributor(
            $projectUri:String,
            $userName:String
        ){
            removeProjectContributor(
                projectUri:$projectUri,
                userName:$userName
            )
        }`
});


export default removeProjectContributor;
