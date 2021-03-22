import React from "react";
import {CreateForm, FormFieldTypes} from "../../components/form";
import * as BsIcon from "react-icons/bs";
import useGroups from "../../api/useGroups";
import useClient from "../../api/client";


const QueryForm = () => {
    const client = useClient();
    const groups = useGroups();
    const groupOptions = groups ? groups.map((g) => {
        return {value: g, foo: g, label: g}
    }) : [];

    const saveit = async () => {
        return new Promise(function (resolve) {
            setTimeout(resolve.bind(null, {}), 1000)
        });
    }

    const create = async ({formData, success, fail}) => {
        let errors = [];
        if (!formData.label)
            errors.push('Name is mandatory')
        if (!formData.description)
            errors.push('Description is mandatory')

        if (errors.length > 0){
            fail({
                header: "Failed",
                list: errors
            })
        }
        else {
            const response = await saveit();
            if (!response.errors) {
                success({
                    header: `Started notebook ${formData.label}`,
                    content: `Successfully started  notebook`
                })
            } else {
                fail({
                    header: "Could not create Notebook",
                    content: `Error`
                })
            }
        }
    }
    return <CreateForm
        ready={true}
        onSubmit={create}
        breadcrumbs={`play/explore/create`}
        backLink={{
            label: '< back to query list',
            link: '/queries'
        }}
        icon={<BsIcon.BsFileCode/>}
        title={`Create Query`}
        submit={create}
        initialValues={{
            label: 'xxx',
            description: '',
            SamlGroupName: 'xxx',
            tags: [],
        }}
        fields={[
            {
                type: FormFieldTypes.Input,
                label: 'Name',
                name: 'label',
                required: true,
            },
            {
                type: FormFieldTypes.TextArea,
                required: true,
                label: 'Description',
                name: 'description',
                width: 16,
            },

            {
                type: FormFieldTypes.Select,
                required: true,
                label: 'Admins',
                name: 'SamlGroupName',
                options: groupOptions
            },

            {
                type: FormFieldTypes.Tags,
                label: 'Tags',
                name: 'tags'
            }
        ]}
    />
}
export default QueryForm;
