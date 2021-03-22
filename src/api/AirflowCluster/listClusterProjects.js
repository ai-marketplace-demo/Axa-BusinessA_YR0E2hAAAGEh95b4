import { gql } from "apollo-boost";

const listAirflowProjects= ({clusterUri,filter})=>{
    return {
        variables:{
            clusterUri:clusterUri,
            filter:filter
        },
        query:gql`
            query listAirflowClusterProjects($clusterUri:String!,$filter:AirflowProjectFilter){
                listAirflowClusterProjects(clusterUri:$clusterUri,filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        projectUri
                        name
                        packageName
                        codeRepositoryName
                        codeRepositoryLink
                        codeRepositoryStatus
                        codePipelineName
                        codePipelineArn
                        codePipelineLink
                        description
                        created
                    }
                }
            }
        `
    }
};


export default listAirflowProjects ;
