import { gql } from 'apollo-boost';

const createShareObject = ({ datasetUri, input }) => {
    console.log('rcv', input);
    return {
        variables: {
            datasetUri,
            input
        },
        mutation: gql`mutation CreateShareObject($datasetUri:String!,$input:NewShareObjectInput){
            createShareObject(datasetUri:$datasetUri,input:$input){
                shareUri
                created
            }
        }`
    };
};


export default createShareObject;
