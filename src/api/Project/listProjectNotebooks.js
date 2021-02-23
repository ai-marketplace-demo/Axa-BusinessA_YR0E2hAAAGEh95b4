import { gql } from 'apollo-boost';

const listProjectNotebooks = ({ projectUri, filter }) => ({
    variables: {
        projectUri,
        filter
    },
    query: gql`
            query ListProjectNotebooks($projectUri:String!,$filter:ProjectNotebookFilter){
                getProject(projectUri:$projectUri){
                        projectUri
                        notebooks(filter:$filter){
                            count
                            page
                            pages
                            hasNext
                            hasPrevious
                            nodes{
                                notebookUri
                                NotebookInstanceName
                                NotebookInstanceStatus
                            }
                        }
                    }
                }
        `
});


export default listProjectNotebooks;
