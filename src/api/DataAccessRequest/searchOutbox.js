import { gql } from 'apollo-boost';

const searchOutbox = ({ filter }) => ({
    variables: { filter },
    query: gql`query RequestsFromMe($filter:ShareObjectFilter){
            requestsFromMe(filter:$filter){
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


export default searchOutbox;
