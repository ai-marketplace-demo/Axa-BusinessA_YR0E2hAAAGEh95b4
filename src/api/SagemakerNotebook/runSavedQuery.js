import { gql } from 'apollo-boost';

const runSavedQuery = ({ savedQueryUri, environmentUri, sqlBody }) => ({
    variables: {
        savedQueryUri,
        environmentUri,
        sqlBody
    },
    query: gql`
            query RunSavedQuery (
                $savedQueryUri:String!,
                $environmentUri:String!,
                $sqlBody:String){
                runSavedQuery(
                    savedQueryUri:$savedQueryUri, 
                    environmentUri:$environmentUri,
                    sqlBody:$sqlBody
                ){
                    metadata{
                        Name
                        DataType
                    }
                    rows{
                        data
                    }
                }
            }
        `
});


export default runSavedQuery;
