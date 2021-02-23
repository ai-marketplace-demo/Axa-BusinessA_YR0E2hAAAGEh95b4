import { gql } from 'apollo-boost';

const listTablePermissions = ({ tableUri }) => ({
    variables: {
        tableUri
    },
    query: gql`
            query GetDatasetTable($tableUri:String!){
                getDatasetTable(tableUri:$tableUri){
                        tableUri
                        permissions{
                            count
                            nodes{
                                userName
                                userRoleForTable
                                created
                            }
                        }
           
                    }
                }
        `
});


export default listTablePermissions;
