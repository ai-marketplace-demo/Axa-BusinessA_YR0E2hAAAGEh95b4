import { gql } from 'apollo-boost';

const searchInbox = ({ filter }) => ({
    variables: { filter },
    query: gql`query RequestsToMe($filter:ShareObjectFilter){
            requestsToMe(filter:$filter){
                count
                page
                pages
                hasNext
                hasPrevious
                nodes{
                    owner
                    created
                    userInitiated
                    confirmed
                    deleted
                    shareUri
                    confirmed
                    principal{
                        principalId
                        principalType
                        principalName
                    }
                    statistics{
                        tables
                        locations
                    }
                    dataset{
                        datasetUri
                        datasetName
                        datasetOrganizationName
                        datasetOrganizationUri
                    }
                }

                
            }
        }`
});


export default searchInbox;
