import { gql } from 'apollo-boost';

const listProjectTables = ({ projectUri, filter }) => ({
    variables: {
        projectUri,
        filter
    },
    query: gql`
            query ListProjectTables($projectUri:String!,$filter:DatasetTableFilter){
                listProjectTables(projectUri:$projectUri,filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        tableUri
                        projectPermission
                        GlueDatabaseName
                        GlueTableName
                        dataset{
                            name
                            datasetUri
                        }
                    }
                }
            }
        `
});


export default listProjectTables;
