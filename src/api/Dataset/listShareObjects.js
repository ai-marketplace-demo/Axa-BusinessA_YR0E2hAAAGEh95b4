import {gql} from "apollo-boost";

const listDatasetShareObjects = ({datasetUri, environmentUri, page}) => {
    return {
        variables: {
            datasetUri: datasetUri,
            environmntUri:environmentUri,
            page: page
        },
        query: gql`
            query ListDatasetShareObjects(
                $datasetUri:String!,
                $environmentUri:String,
                $page:Int){
                listDatasetShareObjects(datasetUri:$datasetUri,environmentUri:$environmentUri,page:$page){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        shareUri
                    }
                }
            }
        `
    }
}


export default listDatasetShareObjects;
