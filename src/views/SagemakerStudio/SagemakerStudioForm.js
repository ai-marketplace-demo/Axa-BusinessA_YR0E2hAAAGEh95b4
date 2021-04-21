import React, {useState, useEffect} from "react";
import {CreateForm, FormFieldTypes} from "../../components/form";
import * as BsIcon from "react-icons/bs";
import useClient from "../../api/client";
import listEnvironments from "../../api/Environment/listEnvironments";

import createSagemakerStudioUserProfile from "../../api/SagemakerStudio/createSagemakerStudioUserProfile";
import useGroups from "../../api/useGroups";

const SagemakerStudioForm = () => {
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

    const fetchEnvironments = async () => {
        const response = await client.query(listEnvironments({filter: {roles: ["Admin", "Owner", "Invited", "DatasetCreator"]}}));
        if (!response.errors) {
            setEnvironmentOptions(response.data.listEnvironments.nodes.map((e) => {
                return {...e, value: e.environmentUri, label: e.label};
            }))
        }
        setReady(true)
    }


    const submitForm = async ({formData, success, fail}) => {
        let errors = [];
        if (!formData.label)
            errors.push('Name is mandatory')
        if (!formData.environment.environmentUri)
            errors.push('Environment is mandatory')
        if (!formData.description)
            errors.push('Description is mandatory')

        if (errors.length > 0) {
            fail({
                header: "Failed",
                list: errors
            })
        } else {
            const response = await client
                .mutate(
                    createSagemakerStudioUserProfile({
                        label: formData.label,
                        description: formData.description,
                        tags: formData.tags,
                        environmentUri: formData.environment.environmentUri,
                        //FIXME needs backend update
                        //SamlAdminGroupName: formData.SamlAdminGroupName ? formData.SamlAdminGroupName.value : null,
                    })
                );
            if (!response.errors) {
                success({
                    header: `Sagemaker studio user profile ${formData.label}`,
                    content: `Created successfully ${response.data.createSagemakerStudioUserProfile.sagemakerStudioUserProfileUri}`
                })
            } else {
                fail({
                    header: `Sagemaker studio user profile  ${formData.label}`,
                    content: `Failed to create user profile due to: ${response.errors[0].message}`
                })
            }
        }
    };

    useEffect(() => {
        if (client) {
            fetchEnvironments();
        }
    }, [client]);

    return <CreateForm
        ready={true}
        onSubmit={submitForm}
        breadcrumbs={`| Work/SagemakerStudio/CreateUserProfile`}
        backLink={{
            label: '< back to sagemaker studio user profile list',
            link: '/sagemakerstudio/userprofiles'
        }}
        icon={<BsIcon.BsFileCode/>}
        title={`Create Sagemaker Studio User Profile`}
        submit={submitForm}
        initialValues={{
            label: '',
            description: '',
            tags: [],
            environment: {},
            SamlAdminGroupName: ''
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
                type: FormFieldTypes.Input,
                required: true,
                label: 'Name',
                name: 'label',
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
                name: 'SamlAdminGroupName',
                options: groupOptions
            },
            {
                type: FormFieldTypes.Tags,
                label: 'Tags',
                name: 'tags'
            }
        ]}
    />
};
export default SagemakerStudioForm;
