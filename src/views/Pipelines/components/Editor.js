import * as Form from "../../../components/form"
import updateSqlPipeline from "../../../api/SqlPipeline/updateSqlPipeline";


const Editor = ({pipeline, client,editable}) => {

    const onSubmit = async ({formData, success, fail}) => {
        const response = await client.mutate(updateSqlPipeline({
            pipelineUri: pipeline.sqlPipelineUri,
            input: {
                label: formData.label,
                description: formData.description,
                tags: formData.tags,
            }
        }))
        if (!response.errors) {
            success({
                header: 'Success',
                content: `Successfully updated pipeline ${pipeline.sqlPipelineUri}`
            })
        } else {
            fail({
                header: 'Failed updating',
                content: `Could not update pipeline, received ${response.error[0].message}`
            })
        }
    }

    const resolveEnvironment = (formData) => {
        if (formData) {
            return formData.environment.label;
        } else {
            return "";
        }
    }
    const resolveOrganization = (formData) => {
        if (formData.organization) {
            return formData.organization.label
        } else {
            return ""
        }
    }


    const resolveRegion = (formData) => {
        if (formData.environment && formData.environment.region) {
            return formData.environment.region
        } else {
            return ""
        }
    }

    const isEditable = (p) => {
        if (!p) {
            return false
        } else {
            if (["Creator", "Admin", "Owner"].indexOf(p.userRoleForPipeline) != -1) {
                return true
            } else {
                return false
            }
        }

    }
    return <Form.EditForm
        onSubmit={onSubmit}
        editable={isEditable(pipeline)}
        initialValues={
            {...pipeline}
        }
        fields={[
            {
                items: [
                    {
                        type: Form.FormFieldTypes.Input,
                        editable: false,
                        name: 'userRoleForPipeline',
                        label: "Role",
                        width: 3,
                        icon: 'shield'

                    },
                    {
                        type: Form.FormFieldTypes.Input,
                        editable: false,
                        width: '4',
                        name: 'owner',
                        label: "Created by",
                        icon: 'user'
                    },
                    {
                        type: Form.FormFieldTypes.Input,
                        editable: false,
                        width: '4',
                        name: 'created',
                        label: "Created",
                        icon: 'calendar'
                    },
                    {
                        type: Form.FormFieldTypes.Input,
                        editable: false,
                        name: 'SamlGroupName',
                        label: "Admins",
                        width: '4',
                        readOnly: true,
                        icon: 'group'
                        //options:[{label:'x',value:'x'},{value:"Team X",label:'TeamX'}]
                    },
                ]
            },
            {
                type: Form.FormFieldTypes.Input,
                name: 'label',
                label: "Name",
                editable: true,
            },
            {
                type: Form.FormFieldTypes.TextArea,
                name: 'description',
                label: "Description",
                editable: true,
            },
            {
                type: Form.FormFieldTypes.Tags,
                editable: true,
                name: 'tags',
                label: "Tags"
            },


        ]}
    />
}

export default Editor;
