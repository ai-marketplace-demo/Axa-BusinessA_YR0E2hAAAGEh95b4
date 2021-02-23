import { gql } from 'apollo-boost';

const createProjectTrustRelationShip = ({ projectUri, input }) => ({
    variables: { input, projectUri },
    mutation: gql`mutation CreateProjectTrustRelationShip(
            $projectUri:String,
            $input:NewProjectTrustRelationship,
        ){
            createProjectTrustRelationShip(
                projectUri:$projectUri,
                input:$input
            )
        }`
});


export default createProjectTrustRelationShip;
