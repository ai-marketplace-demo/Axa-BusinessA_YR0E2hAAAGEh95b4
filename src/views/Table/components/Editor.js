import * as Form from "../../../components/form"
import GlossaryEditor from "../../../components/glossaryeditor/glossaryeditor";
import updateDatasetTable from "../../../api/DatasetTable/updateDatasetTable";
const Editor = ({table, client}) => {

    const save = async ({formData, success, fail}) => {
        const response = await client.mutate(updateDatasetTable({
            tableUri:table.tableUri,
            input:{
                description : formData.description,
                tags: formData.tags,
                terms:formData.terms.map(t=>t.value)
            }
        }))
        if (!response.errors){
            success({
                content: `Update table ${table.GlueTableName}`,
                header: 'Successfull Update'
            })
        }else {
            fail({
                content: `Could not update table ${table.GlueTableName}, received ${response.errors[0].message}`,
                header: 'Failed Update'
            })

        }

    }
    const isAdmin = () => {
        return ["Creator", "Admin", "Owner"].indexOf(table?.dataset?.userRoleForDataset) === -1 ? false : true
    }
    return <Form.EditForm
            client={client}
            onSubmit={save}
            editable={isAdmin()}
            initialValues={{...table, terms:table.terms||[],tags:table.tags||[]}}
            fields={[
                {
                    items: [
                        {
                            type: Form.FormFieldTypes.Input,
                            editable: false,
                            width: '4',
                            icon:`user`,
                            name: 'owner',
                            label: "Created by"
                        },
                        {
                            type: Form.FormFieldTypes.Input,
                            editable: false,
                            icon:`calendar`,
                            name: 'created',
                            width: '4',
                            label: "Created"
                        },

                    ]
                },
                {
                    type: Form.FormFieldTypes.Input,
                    name: 'GlueDatabaseName',
                    label: "Database",
                    icon:`database`,
                    editable: false,
                },
                {
                    type: Form.FormFieldTypes.Input,
                    name: 'GlueTableName',
                    label: "Table Name",
                    icon:`table`,
                    editable: false,
                },
                {
                    type: Form.FormFieldTypes.TextArea,
                    name: 'description',
                    icon:'table',
                    label: "Description",
                    editable: true,
                },
                {
                    type: Form.FormFieldTypes.Tags,
                    editable: true,
                    name: 'tags',
                    label: "Tags"
                },
                {
                    type: Form.FormFieldTypes.Term,
                    editable: true,
                    name: 'terms',
                    label: "Terms"
                },

            ]}
        />


}

export default Editor;
