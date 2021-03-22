import {gql} from "apollo-boost";

const listDatasetTables = ({datasetUri, filter}) => {
    return {
        variables: {
            datasetUri: datasetUri,
            filter: filter
        },
        query: gql`
            query GetDataset($datasetUri:String!,$filter:DatasetTableFilter){
                getDataset(datasetUri:$datasetUri){
                    tables(filter:$filter){
                        count
                        page
                        pages
                        hasNext
                        hasPrevious
                        nodes{
                            dataset{
                                datasetUri
                            }
                            terms{
                                nodes{
                                    label
                                }
                            }
                            tableUri
                            name
                            created
                            GlueTableName
                            GlueDatabaseName
                            description
                            stage
                            userRoleForTable

                        }
                    }

                }
            }
        `
    }
}


export default listDatasetTables;
