import { gql } from 'apollo-boost';

const listProjectDatasets = ({ projectUri, filter }) => ({
    variables: {
        projectUri,
        filter
    },
    query: gql`
            query ListProjectDatasets($projectUri:String!,$filter:ProjectDatasetFilter){
                listProjectDatasets(projectUri:$projectUri,filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        datasetUri
                        name
                        label
                        region
                        tags
                        userRoleForDataset
                        projectPermission(projectUri:$projectUri)
                        description
                        organization{
                            name
                            organizationUri
                            label
                        }
                        statistics{
                            tables
                            locations
                        }
                        environment{
                            environmentUri
                            name
                            AwsAccountId
                            SamlGroupName
                            region
                        }

                    }
                }
            }
        `
});


export default listProjectDatasets;
