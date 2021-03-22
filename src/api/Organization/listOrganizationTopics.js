import { gql } from "apollo-boost";

const listOrganizationTopics= ({filter,organizationUri})=>{
    return {
        variables:{
            organizationUri: organizationUri,
            filter:filter
        },
        query:gql`
            query ListOrganizationTopics($organizationUri:String,$filter:OrganizationTopicFilter){
                listOrganizationTopics(organizationUri:$organizationUri,filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        label
                        topicUri
                        description
                    }
                }

            }
        `
    }
}


export default listOrganizationTopics;
