import { gql } from "apollo-boost";

const getWorksheet=(worksheetUri)=>{
    return {
        variables:{
            worksheetUri  : worksheetUri
        },
        query :gql`query GetWorksheet(
            $worksheetUri:String!,
        ){
        getWorksheet(worksheetUri:$worksheetUri){
                worksheetUri
                label
                description
                tags
                sqlBody
                chartConfig {
                    dimensions{
                        columnName
                    }
                    measures{
                        columnName
                        aggregationName
                    }
                }
                owner
                created
                updated
                userRoleForWorksheet
                lastSavedQueryResult{
                    AthenaQueryId
                    ElapsedTimeInMs
                    Error
                    DataScannedInBytes
                    Status
                    columns{
                        columnName
                        typeName
                    }
                    rows{
                        cells{
                            value
                            columnName
                            
                        }
                    }
                }
            }
        }`
    }
}


export default getWorksheet;
