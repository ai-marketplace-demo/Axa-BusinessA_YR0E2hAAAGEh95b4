import React, {useState} from "react";
import {CreateForm, FormFieldTypes} from "../../components/form";
import * as BsIcon from "react-icons/bs";
import useGroups from "../../api/useGroups";
import useClient from "../../api/client";
import createGlossary from "../../api/Glossary/createGlossary";



const GlossaryForm = () => {
    const client = useClient();
    const groups = useGroups();
    const groupOptions = groups ? groups.map((g) => {
        return {value: g, foo: g, label: g}
    }) : [];



    const onSubmit = async ({formData, success, fail}) => {
        let errors = [];
        if (!formData.label)
            errors.push('Name is mandatory')
        if (!formData.readme)
            errors.push('Readme is mandatory')
        if (!formData.status)
            errors.push('Status is mandatory')

        if (errors.length > 0){
            fail({
                header: "Failed",
                list: errors
            })
        }

        else {
            const response = await client.mutate(createGlossary({
                label: formData.label,
                readme: formData.label,
                status: formData.status.value
            }));
            if (!response.errors) {
                success({
                    header: `Created glossary ${formData.label}`,
                    content: `Successfully created glossary`
                })
            } else {
                fail({
                    header: "Could not save glossary",
                    content: `Error`
                })
            }
        }
    }
    return <CreateForm
        ready={true}
        onSubmit={onSubmit}
        breadcrumbs={`| catalog/organize/glossary/create`}
        backLink={{
            label: '< back to glossary list',
            link: '/glossaries'
        }}
        icon={<BsIcon.BsTag/>}
        title={`Create Glossary`}
        initialValues={{
            label: '',
            readme: '',
            status :{value:'Draft', lavel:'draft'},
            tags: [],
        }}
        fields={[
            {
                type: FormFieldTypes.Input,
                label: 'Name',
                name: 'label',
                icon:'info',
                required: true,
            },
            {
                type: FormFieldTypes.TextArea,
                required: true,
                icon:'info',
                label: 'Readme',
                name: 'readme',
                width: 16,
            },
            {
                type: FormFieldTypes.Select,
                required: true,
                label: 'Status',
                icon:'info',
                name: 'status',
                options: [{label:'Draft',value:'Draft'},{label:'Approved',value:'Approved'}]
            },
            {
                type: FormFieldTypes.Tags,
                label: 'Tags',
                icon:'tags',
                name: 'tags'
            }
        ]}
    />
}
export default GlossaryForm
