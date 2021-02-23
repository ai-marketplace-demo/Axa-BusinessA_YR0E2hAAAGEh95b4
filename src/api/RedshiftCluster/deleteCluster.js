import { gql } from 'apollo-boost';

const deleteRedshiftCluster = (clusterUri) => ({
    variables: {
        clusterUri
    },
    mutation: gql`mutation deleteRedshiftCluster(
            $clusterUri : String!
        ){
            deleteRedshiftCluster(clusterUri:$clusterUri)
        }`
});


export default deleteRedshiftCluster;
