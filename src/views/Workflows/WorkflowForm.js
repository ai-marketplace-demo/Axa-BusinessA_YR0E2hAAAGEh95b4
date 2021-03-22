import React, {useState, useEffect}  from "react";
import {CreateForm, FormFieldTypes} from "../../components/form";
import * as SiIcon from "react-icons/si";
import useClient from "../../api/client";
import listEnvironments from "../../api/Environment/listEnvironments";
import createAirflowCluster from "../../api/AirflowCluster/createCluster";
import useGroups from "../../api/useGroups";

const WorkflowForm = () => {
    const client = useClient();
    const groups = useGroups();
    const [environmentOptions, setEnvironmentOptions] = useState([]);
    const [ready, setReady] = useState(false);
    const groupOptions = groups ? groups.map((g) => {
        return {value: g, foo: g, label: g}
    }) : [];
    const environmentClasses = [
        {label: 'mw1.small', value: 'mw1.small'},
        {label: 'mw1.medium', value: 'mw1.medium'},
        {label: 'mw1.large', value: 'mw1.large'}
    ];



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
        if (!formData.vpc)
            errors.push('VPC ID is mandatory')
        if (!formData.maxWorkers)
            errors.push('Max worker count is mandatory')
        if (!formData.environmentClass)
            errors.push('Environment class is mandatory')

        if (errors.length > 0){
            fail({
                header: "Failed to create environment",
                list: errors
            })
        }
        else {
            let input = {
                label: formData.label,
                description: formData.description,
                vpc: formData.vpc,
                tags: formData.tags,
                maxWorkers: parseInt(formData.maxWorkers),
                environmentClass: formData.environmentClass.value,

                //SamlAdminGroupName: formData.SamlAdminGroupName ? formData.SamlAdminGroupName.value : null,
            }
            const response = await client
                .mutate(createAirflowCluster({
                environmentUri: formData.environment.environmentUri,
                input: input
            }))

            if (!response.errors) {
                success({
                    header: `Airflow Environment ${formData.label}`,
                    content: `Created successfully ${response.data.createAirflowCluster.clusterUri}`
                })
            } else {
                fail({
                    header: `Airflow Environment ${formData.label}`,
                    content: `Failed to create Airflow environment due to: ${response.errors[0].message}`
                })
            }
        }
    };

    useEffect(()=>{
        if (client){
            fetchEnvironments();
        }
    },[client]);

    return <CreateForm
        ready={true}
        onSubmit={submitForm}
        breadcrumbs={`| Work/Workflows/Create`}
        backLink={{
            label: '< back to workflows list',
            link: '/workflows'
        }}
        icon={<SiIcon.SiApacheairflow/>}
        title={`Create Airflow Environment`}
        submit={submitForm}
        initialValues={{
            label: '',
            description: '',
            vpc:'',
            tags: [],
            environment: {},
            SamlAdminGroupName: '',
            environmentClass: '',
            maxWorkers: 1,
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
                type: FormFieldTypes.Input,
                label: 'VPC ID (must have private subnets)',
                name: 'vpc',
                placeholder: 'vpc-12345678012',
                required: true,

            },
            {
                type: FormFieldTypes.Input,
                label: 'Max Worker Count',
                name: 'maxWorkers',
                required: true,

            },
            {
                type: FormFieldTypes.Select,
                label: 'Environment Class',
                name: 'environmentClass',
                required: true,
                options: environmentClasses
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
export default WorkflowForm;
