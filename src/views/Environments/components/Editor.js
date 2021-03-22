import * as Form from "../../../components/form"
import updateEnvironment from "../../../api/Environment/updateEnvironment";
import useClient from "../../../api/client";
import {useParams} from "react-router-dom";


const Editor = ({editable, environment}) => {

    const client = useClient();
    const params = useParams();

    const onSubmit = async ({formData, success, fail}) => {
        const response = await client.mutate(updateEnvironment({
            environmentUri: environment.environmentUri,
            input: {
                label: formData.label,
                description: formData.description,
                tags: formData.tags
            }
        }))
        if (!response.errors) {
            success({
                header: 'Success',
                content: `Successfully updated environment ${environment.environmentUri}`
            })
        } else {
            fail({
                header: 'Failed updating',
                content: `Could not update environment, received ${response.errors[0].message}`
            })
        }

    }
    return <Form.EditForm
        onSubmit={onSubmit}
        editable={editable}
        initialValues={environment}
        fields={[
            {
                items: [
                    {
                        type: Form.FormFieldTypes.Input,
                        editable: false,
                        width: '4',
                        name: 'owner',
                        label: "Created by",
                        icon: 'user',
                    },
                    {
                        type: Form.FormFieldTypes.Input,
                        editable: false,
                        name: 'SamlGroupName',
                        label: "Admins",
                        width: '4',
                        readOnly: true,
                        icon: 'group'
                    },
                    {
                        type: Form.FormFieldTypes.Input,
                        editable: false,
                        name: 'created',
                        width: '4',
                        label: "Created",
                        icon: 'calendar'
                    },


                ]
            },
            {
                type: Form.FormFieldTypes.Input,
                name: 'label',
                label: "Name",
                editable: true,
                icon: 'info',
            },
            {
                type: Form.FormFieldTypes.TextArea,
                name: 'description',
                label: "Description",
                editable: true,
                icon: 'info',
            },
            {
                type: Form.FormFieldTypes.Tags,
                editable: true,
                name: 'tags',
                label: "Tags",
                icon: 'info',
            },


        ]}
    />
}

export default Editor;
