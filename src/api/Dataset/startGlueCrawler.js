import { gql } from "apollo-boost";

const startGlueCrawler=({datasetUri, input})=>{
    return {
        variables:{
            datasetUri: datasetUri,
            input : input
        },
        mutation :gql`mutation StartGlueCrawler($datasetUri:String, $input:CrawlerInput){
            startGlueCrawler(datasetUri:$datasetUri,input:$input){
                Name
                AwsAccountId
                region
                status
            }
        }`
    }
}


export default startGlueCrawler;
