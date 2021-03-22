import { gql } from "apollo-boost";

const searchAirflowClusters= (filter)=>{
    return {
        variables:{
            filter:filter,
        },
        query:gql`
            query searchAirflowClusters($filter:AirflowClusterFilter){
                searchAirflowClusters(filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        clusterUri
                     environmentUri
                     name
                     label
                     description
                     tags
                     owner
                     created
                     updated
                     AwsAccountId
                     region
                     clusterArn
                     clusterName
                     created
                     kmsAlias
                     status
                     CFNStackName
                     CFNStackStatus
                     CFNStackArn
                     IAMRoleArn
                     subnetIds
                     securityGroupIds
                     userRoleForCluster
                     userRoleInEnvironment
                     imported
                     vpc
                        organization{
                            organizationUri
                            label
                            name
                        }
                        environment{
                            environmentUri
                            label
                            name
                        }
                        
                    }
                }
            }
        `
    }
};


export default searchAirflowClusters ;
