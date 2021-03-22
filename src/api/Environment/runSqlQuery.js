import { gql } from "apollo-boost";

const runSqlQuery= ({sqlQuery,environmentUri})=>{
    return {
        variables:{
            sqlQuery:sqlQuery,
            environmentUri: environmentUri
        },
        query:gql`
            query RunSqlQuery($environmentUri:String!,$sqlQuery:String!){
                runAthenaSqlQuery(environmentUri:$environmentUri,sqlQuery:$sqlQuery){
                    rows{
                        cells{
                            columnName
                            typeName
                            value                            
                        }
                    }
                    columns{
                        columnName
                        typeName
                    }
                }
            }
        `
    }
}


export default runSqlQuery ;
