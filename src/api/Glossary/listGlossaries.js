import { gql } from "apollo-boost";

const listGlossaries=(filter)=>{
    return {
        variables:{
            filter: filter
        },
        query:gql`query ListGlossaries($filter:GlossaryFilter){
            listGlossaries(filter:$filter){
                count
                page
                pages
                hasNext
                hasPrevious
                nodes{
                    nodeUri
                    label
                    readme
                    created
                    owner
                    path
                    stats{
                        categories
                        terms
                        associations
                    }
                }
            }
        }`
    }
}


export default listGlossaries;
