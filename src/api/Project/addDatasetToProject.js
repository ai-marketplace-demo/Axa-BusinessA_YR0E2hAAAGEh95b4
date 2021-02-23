import { gql } from 'apollo-boost';

const addDatasetToProject = ({ projectUri, datasetUri }) => ({
    variables: { projectUri, datasetUri },
    mutation: gql`mutation AddDatasetToProject(
            $projectUri:String,
            $datasetUri:String,
        ){
            addDatasetToProject(
                projectUri:$projectUri,
                datasetUri:$datasetUri
            ){
                projectUri
                label
                userRoleInProject
                userRoleInEnvironment
            }
        }`
});


export default addDatasetToProject;
