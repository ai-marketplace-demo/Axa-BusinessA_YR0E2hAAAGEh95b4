import { gql } from "apollo-boost";

const getDatasetTableProfilingRun=(tableUri)=>{
    return {
        variables:{
            tableUri: tableUri
        },
        query :gql`query getDatasetTableProfilingRun($tableUri:String!){
            getDatasetTableProfilingRun(tableUri:$tableUri){
                profilingRunUri
                status
                GlueTableName
                datasetUri
                GlueJobName
                GlueJobRunId
                GlueTriggerSchedule
                GlueTriggerName
                GlueTableName
                AwsAccountId
                results
                status
            }
        }`
    }
}


export default getDatasetTableProfilingRun;
