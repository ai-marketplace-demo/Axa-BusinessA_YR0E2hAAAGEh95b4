import { gql } from "apollo-boost";

const runSavedQuery = ({savedQueryUri, sqlBody})=>{
    return {
        variables:{
            savedQueryUri:savedQueryUri,
            //environmentUri: environmentUri,
            sqlBody : sqlBody
        },
        query:gql`
            query RunSavedQuery (
                $savedQueryUri:String!,
                $sqlBody:String){
                runSavedQuery(
                    savedQueryUri:$savedQueryUri, 
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
    }
}


export default runSavedQuery ;
