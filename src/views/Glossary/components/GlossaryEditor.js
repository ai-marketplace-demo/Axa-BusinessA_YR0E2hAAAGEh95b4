import * as Form from "../../../components/form"
import updateGlossary from "../../../api/Glossary/updateGlossary";
import useClient from "../../../api/client";
import {useParams} from "react-router-dom";


const GlossaryEditor = ({editable, glossary}) => {

    const client = useClient();
    const params = useParams();

    const onSubmit = async ({formData, success, fail}) => {
        const response = await client.mutate(updateGlossary({
            nodeUri: glossary.nodeUri,
            input: {
                label: formData.label,
                readme: formData.readme,
                status: formData.status.value
            }
        }))
        if (!response.errors) {
            success({
                header: 'Success',
                content: `Successfully updated glossary ${glossary.nodeUri}`
            })
        } else {
            fail({
                header: 'Failed updating',
                content: `Could not update glossary, received ${response.errors[0].message}`
            })
        }

    }
    return <Form.EditForm
        onSubmit={onSubmit}
        editable={editable}
        initialValues={glossary}
        fields={[
            {
                items: [
                    {
                        type: Form.FormFieldTypes.Input,
                        editable: false,
                        width: '4',
                        name: 'owner',
                        label: "Created by"
                    },
                    {
                        type: Form.FormFieldTypes.Input,
                        editable: false,
                        name: 'SamlGroupName',
                        label: "Admins",
                        width: '4',
                    },
                    {
                        type: Form.FormFieldTypes.Input,
                        editable: false,
                        name: 'created',
                        width: '4',
                        label: "Created"
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
                name: 'readme',
                label: "Readme",
                editable: true,
            },
            {
                type: Form.FormFieldTypes.Select,
                editable: true,
                options:[{label:'Draft',value:'Draft'},{label:'Approved',value:'Approved'}],
                name: 'status',
                label: "Tags"
            },
        ]}
    />
}

export default GlossaryEditor;
