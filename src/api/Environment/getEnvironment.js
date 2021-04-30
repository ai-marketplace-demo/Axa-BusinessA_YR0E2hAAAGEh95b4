import { gql } from "apollo-boost";

const getEnvironment = ({environmentUri})=>{
    return {
        variables:{
            environmentUri: environmentUri
        },
        query:gql`
            query GetEnvironment($environmentUri:String){
                getEnvironment(environmentUri:$environmentUri){
                    environmentUri
                    created
                    userRoleInEnvironment
                    description
                    name
                    label
                    AwsAccountId
                    quicksight_enabled
                    region
                    owner
                    tags
                    SamlGroupName
                    subscriptionsEnabled
                    subscriptionsProducersTopicImported
                    subscriptionsConsumersTopicImported
                    subscriptionsConsumersTopicName
                    subscriptionsProducersTopicName
                    organization{
                        organizationUri
                        label
                        name
                        userRoleInOrganization
                    }
                    stack{
                        stack
                        status
                        stackUri
                        targetUri
                        accountid
                        region
                        stackid
                        link
                        outputs
                        resources
                    }
                }
            }
        `
    }
}


export default getEnvironment ;
