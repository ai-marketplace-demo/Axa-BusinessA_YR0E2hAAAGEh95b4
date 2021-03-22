import { gql } from "apollo-boost";

const listGlossaryAssociations=({nodeUri,filter})=>{
    return {
        variables:{
            nodeUri: nodeUri,
            filter:filter
        },
        query:gql`query GetGlossaryTree(
            $nodeUri:String!,
            $filter:GlossaryTermTargetFilter
        ){
            getGlossary(nodeUri:$nodeUri){
                nodeUri
                label
                readme
                created
                owner
                status
                path
                associations(filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        linkUri
                        targetUri
                        approvedBySteward
                        term{
                            label
                            nodeUri
                        }
                        targetType
                        target{
                            __typename
                            ...on Dataset{
                                datasetUri
                                name
                                label
                            }
                            ...on DatasetTable{
                                tableUri
                                name
                                label
                            }
                        }
                    }
                    
                }

            }
        }
        `
    }
}


export default listGlossaryAssociations;
