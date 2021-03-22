import * as Form from "../../../components/form"
import updateOrganization from "../../../api/Organization/updateOrganization";
import useClient from "../../../api/client";
import {useParams} from "react-router-dom";


const OrganizationEditor = ({editable, organization}) => {
    const client = useClient();
    const params = useParams();

    const onSubmit = async ({formData, success, fail}) => {
        const response = await client.mutate(updateOrganization({
            organizationUri: params.uri,
            input: {
                label: formData.label,
                description: formData.description,
                tags: formData.tags
            }
        }))
        if (!response.errors) {
            success({
                header: 'Success',
                content: `Successfully updated organization ${organization.organizationUri}`
            })
        } else {
            fail({
                header: 'Failed updating',
                content: `Could not update organization, received ${response.error[0].message}`
            })
        }

    }

    return <Form.EditForm
        onSubmit={onSubmit}
        editable={editable}
        initialValues={organization}
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
                icon: 'info',
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

export default OrganizationEditor;
