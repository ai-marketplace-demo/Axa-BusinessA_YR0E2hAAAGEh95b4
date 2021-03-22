import { gql } from "apollo-boost";

const listDatasetContributors= ({datasetUri,filter})=>{
    return {
        variables:{
            datasetUri:datasetUri,
            filter:filter
        },
        query:gql`
            query GetDataset($filter:DatasetContributorFilter,$datasetUri:String!){
                getDataset(datasetUri:$datasetUri){
                        datasetUri
                        contributors(filter:$filter){
                            count
                            page
                            pageSize
                            hasNext
                            hasPrevious
                            pages
                            nodes{
                                userName
                                userRoleForDataset
                                userRoleInEnvironment
                                created
                            }
                        }
           
                    }
                }
        `
    }
}


export default listDatasetContributors ;
