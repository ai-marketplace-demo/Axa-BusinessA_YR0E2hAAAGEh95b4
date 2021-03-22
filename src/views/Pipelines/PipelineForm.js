import {useEffect, useState} from "react";
import {CreateForm, FormFieldTypes} from "../../components/form";
import * as BsIcon from "react-icons/bs";
import useGroups from "../../api/useGroups";
import useClient from "../../api/client";
import createSqlPipeline from "../../api/SqlPipeline/createSqlPipeline";
import listEnvironments from "../../api/Environment/listEnvironments";


const PipelineForm = () => {
    const client = useClient();
    const groups = useGroups();
    const [environmentOptions, setEnvironmentOptions] = useState([]);
    const [ready, setReady] = useState(false);
    const groupOptions = groups ? groups.map((g) => {
        return {value: g, foo: g, label: g}
    }) : [];

    const resolveOrganization = (formData) => {
        if (formData.environment && formData.environment.organization) {
            return formData.environment.organization.organizationUri
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
            errors.push('Name is mandatory')
        if (!formData.environment.environmentUri)
            errors.push('Environment is mandatory')
        if (!formData.description)
            errors.push('Description is mandatory')

        if (errors.length > 0){
            fail({
                header: "Failed",
                list: errors
            })
        }
        else {
            const response = await client.mutate(createSqlPipeline({
                input: {
                    label: formData.label,
                    environmentUri: formData.environment.environmentUri,
                    tags: formData.tags,
                    description: formData.description,
                    SamlGroupName: formData.SamlGroupName ? formData.SamlGroupName.value: null,
                }
            }))
            if (!response.errors) {
                success({
                    header: `Success`,
                    content: `Successfully created pipeline ${response.data.createSqlPipeline.sqlPipelineUri}`
                })
            } else {
                fail({
                    header: "Failed",
                    content: `Could not create pipeline, received ${response.errors[0].message}`
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

    return <CreateForm
        ready={true}
        onSubmit={onSubmit}
        breadcrumbs={`| play/pipelines/create`}
        backLink={{
            label: '< back to pipeline list',
            link: '/pipelines'
        }}
        icon={<BsIcon.BsFileCode/>}
        title={`Deploy Pipeline`}
        initialValues={{
            label: 'xxx',
            description: '',
            environment: {},
            SamlGroupName: {},
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
export default PipelineForm;
