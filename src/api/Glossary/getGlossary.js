import { gql } from "apollo-boost";

const getGlossary=(nodeUri)=>{
    return {
        variables:{
            nodeUri: nodeUri
        },
        query:gql`query GetGlossary($nodeUri:String!){
            getGlossary(nodeUri:$nodeUri){
                    nodeUri
                    label
                    readme
                    created
                    owner
                    status
                    path
                    stats{
                        categories
                        terms
                        associations
                    }
                    associations{
                        count
                        page
                        pages
                        hasNext
                        hasPrevious
                        nodes{
                            __typename
                            target{
                                ...on Dataset{
                                    label
                                }
                                ...on DatasetTable{
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


export default getGlossary;
