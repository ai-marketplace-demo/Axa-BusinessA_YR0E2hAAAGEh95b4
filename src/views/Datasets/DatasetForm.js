import {useEffect, useState} from "react";
import {CreateForm, FormFieldTypes} from "../../components/form";
import * as BsIcon from "react-icons/bs";
import useGroups from "../../api/useGroups";
import useClient from "../../api/client";
import {TopicsData} from "../../components/topics";
import createDataset from "../../api/Dataset/createDataset";
import listEnvironments from "../../api/Environment/listEnvironments";

const DatasetForm = () => {
    const client = useClient();
    const groups = useGroups();
    const [environmentOptions, setEnvironmentOptions] = useState([]);
    const [ready, setReady] = useState(false);
    const groupOptions = groups ? groups.map((g) => {
        return {value: g, foo: g, label: g}
    }) : [];


    const resolveOrganization = (formData) => {
        if (formData.environment && formData.environment.organization) {
            return formData.environment.organization.label
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

    const onSubmit = async ({formData, success, fail}) => {
        let errors = [];
        if (!formData.label)
            errors.push('Dataset name is mandatory')
        if (!formData.environment.environmentUri)
            errors.push('Dataset environment is mandatory')
        if (!formData.description)
            errors.push('Dataset description is mandatory')

        if (errors.length > 0){
            fail({
                header: "Failed",
                list: errors
            })
        }

        else {
            const response = await client.mutate(createDataset({
                label: formData.label,
                topics: formData.topics ? formData.topics.map((t) => {
                    return t.value
                }) : [],
                tags: formData.tags,
                SamlAdminGroupName:  formData.SamlAdminGroupName ? formData.SamlAdminGroupName.value : null,
                businessOwnerEmail: formData.businessOwnerEmail,
                owner: formData.businessOwnerEmail,
                businessOwnerDelegationEmails: formData.businessOwnerDelegationEmails ? formData.businessOwnerDelegationEmails.map((s) => {
                    return s.value
                }) : [],
                description: formData.description,
                environmentUri: formData.environment.environmentUri,
                organizationUri: formData.environment.organization.organizationUri
            }));
            if (!response.errors) {
                success({
                    header: `Success`,
                    content: `Successfully created dataset ${response.data.createDataset.datasetUri}`
                })
            } else {
                fail({
                    header: "Failed",
                    content: `Failed to create dataset, received ${response.errors[0].message}`
                })
            }
        }
    }


    const fetchEnvironments = async () => {
        const response = await client.query(listEnvironments({filter: {roles: ["Admin", "Owner", "Invited", "DatasetCreator"]}}));
        if (!response.errors) {
            setEnvironmentOptions(response.data.listEnvironments.nodes.map((e) => {
                return {...e, value: e.environmentUri, label: e.label};
            }))
        }
        setReady(true)
    }
    useEffect(() => {
        if (client) {
            fetchEnvironments();
        }
    }, [client])

    return <div>
        <CreateForm
        ready={ready}
        onSubmit={onSubmit}
        breadcrumbs={`| catalog/contribute/datasets/create`}

        backLink={{
            label: '< back to datasets',
            link: `/datasets/`
        }}
        icon={<BsIcon.BsFolder/>}
        title={`Create Dataset`}
        initialValues={{
            environment: {},
            businessOwnerEmail: "",
            businessOwnerDelegationEmails: [],
            label: 'My dataset',
            description: 'Describe Dataset',
            SamlGroupName: groupOptions[0],
            tags: [],
        }}
        fields={[
            {
                items: [
                    {
                        type: FormFieldTypes.Select,
                        label: 'Environment',
                        name: 'environment',
                        required: true,
                        width: "6",
                        options: environmentOptions
                    },
                    {
                        type: FormFieldTypes.Input,
                        label: 'Region',
                        name: 'region',
                        width: '6',
                        readOnly: true,
                        value: resolveRegion
                    },
                    {
                        type: FormFieldTypes.Input,
                        label: 'Organization',
                        name: 'organization',
                        width: '6',
                        readOnly: true,
                        value: resolveOrganization
                    },

                ]
            },

            {
                items: [
                    {
                        type: FormFieldTypes.Input,
                        label: 'Business Owner',
                        name: 'businessOwnerEmail',
                        width: 8
                    },

                    {
                        type: FormFieldTypes.MultiSelect,
                        label: 'Stewards',
                        width: 8,
                        options: [],
                        name: 'businessOwnerDelegationEmails',
                    },

                ]
            },


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
                name: 'SamlAdminGroupName',
                options: groupOptions
            },
            {
                items: [
                    {
                        type: FormFieldTypes.Tags,
                        label: 'Tags',
                        width: '8',
                        name: 'tags'
                    },
                    {
                        type: FormFieldTypes.MultiSelect,
                        label: 'Topics',
                        width: '8',
                        name: 'topics',
                        options: TopicsData

                    }
                ]
            },

        ]}
    /></div>
};

export default DatasetForm;
