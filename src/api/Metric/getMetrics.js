import { gql } from "apollo-boost";

const getMetrics= (filter)=>{
    return {
        variables:{
            filter: filter,
        },
        query:gql`
            query GetMetrics($filter:MetricFilter){
                getMetrics(filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    nodes{
                        metricName
                        metricValue
                        AwsAccountId
                        region
                        created
                    }
                }
            }
        `
    }
}


export default getMetrics;
