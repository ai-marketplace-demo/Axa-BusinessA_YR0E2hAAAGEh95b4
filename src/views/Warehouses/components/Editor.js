import * as Form from "../../../components/form"
import FormFieldTypes from "../../../components/form/FormFieldTypes";


const Editor = ({warehouse, editable}) => {
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


    return <Form.EditForm
        onSubmit={()=>{}}
        editable={editable}
        initialValues={
            {...warehouse}
        }

        fields={[

            {
                items: [
                    {
                        type: Form.FormFieldTypes.Input,
                        editable: false,
                        name: 'userRoleForCluster',
                        label: "Role",
                        width: 4,
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
                        name: 'SamlAdminGroupName',
                        label: "Admins",
                        width: '4',
                        readOnly: true,
                        icon: 'group'
                    },
                ]
            },
            {
                items: [
                    {
                        type: FormFieldTypes.Input,
                        label: 'Environment',
                        width: "6",
                        value: resolveEnvironment,
                        readOnly: true,
                        icon: 'cloud'
                    },
                    {
                        type: FormFieldTypes.Input,
                        label: 'Region',
                        name: 'region',
                        width: '6',
                        readOnly: true,
                        icon: 'globe'
                    },
                    {
                        type: FormFieldTypes.Input,
                        label: 'Organization',
                        name: 'organization',
                        width: '6',
                        readOnly: true,
                        icon: 'boxes',
                        value: resolveOrganization
                    },
                ]
            },
            {
                type: Form.FormFieldTypes.Input,
                name: 'label',
                label: "Name",
                icon: 'info',
                editable: true,
            },
            {
                type: Form.FormFieldTypes.TextArea,
                name: 'description',
                label: "Description",
                editable: true,
                icon: 'info'
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
