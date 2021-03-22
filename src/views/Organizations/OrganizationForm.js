import React from "react";
import {CreateForm, FormFieldTypes} from "../../components/form";
import * as BsIcon from "react-icons/bs";
import useGroups from "../../api/useGroups";
import useClient from "../../api/client";
import createOrganization from "../../api/Organization/createOrganization";

const OrganizationForm = () => {
    const client = useClient();
    const groups = useGroups();
    const groupOptions = groups ? groups.map((g) => {
        return {value: g, foo: g, label: g}
    }) : [];

    const submitForm = async ({formData, success, fail}) => {
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
            const response = await client.mutate(createOrganization({
                label: formData.label,
                description: formData.description,
                SamlGroupName: formData.SamlGroupName ? formData.SamlGroupName.value: null,
                tags: formData.tags
            }))
            if (!response.errors) {
                success({
                    header: `Success`,
                    content: `Created org ${formData.label} ${response.data.createOrganization.organizationUri}`
                })
            } else {
                fail({
                    header: `Failed`,
                    content: `Could not create org, received ${response.errors[0].message}`
                })
            }
        }
    }


    return <CreateForm
        ready={true}
        onSubmit={submitForm}
        breadcrumbs={`| onboard/organization/create`}

        backLink={{
            label: '< back to organizations',
            link: '/organizations'
        }}
        icon={<BsIcon.BsHouse/>}
        title={`Create Organization`}
        submit={createOrganization}
        initialValues={{
            label: '',
            description: '',
            SamlGroupName: '',
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
export default OrganizationForm
