import * as Form from "../../../components/form"


const Editor = ({environment}) => {

    const save = async ({fomData, success, fail}) => {
        console.log("....")
        success({
            header: 'ok',
            content: 'cool'
        })
    }
    return <Form.EditForm
        onSubmit={save}
        initialValues={{
            label: 'xxx',
            description: 'xxxx sssss',
            tags: ["a"],
            owner: 'moshirm@amazon.fr',
            SamlGroupName: {value: "Team X", label: 'TeamX'}
        }}
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
                        type: Form.FormFieldTypes.Select,
                        editable: true,
                        name: 'SamlGroupName',
                        label: "Admins",
                        width: '4',
                        options: [{label: 'x', value: 'x'}, {value: "Team X", label: 'TeamX'}]
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
