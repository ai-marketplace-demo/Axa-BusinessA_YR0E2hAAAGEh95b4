import { gql } from "apollo-boost";

const listDatasetLoaders= ({datasetUri,filter})=>{
    return {
        variables:{
            datasetUri:datasetUri,
            filter:filter
        },
        query:gql`
            query GetDataset($filter:DatasetLoaderFilter,$datasetUri:String!){
                getDataset(datasetUri:$datasetUri){
                        datasetUri
                        loaders(filter:$filter){
                            count
                            page
                            pageSize
                            hasNext
                            hasPrevious
                            pages
                            nodes{
                                loaderUri
                                description
                                label
                                IAMPrincipalArn
                                description
                                label
                                tags
                            }
                        }
           
                    }
                }
        `
    }
}


export default listDatasetLoaders ;
