import React, {useState, useEffect}  from "react";
import {CreateForm, FormFieldTypes} from "../../components/form";
import {useParams} from "react-router-dom";
import useClient from "../../api/client";
import listEnvironments from "../../api/Environment/listEnvironments";
import useGroups from "../../api/useGroups";
import * as Yup from 'yup';
import createRedshiftCluster from '../../api/RedshiftCluster/createCluster';
import * as FiIcon from 'react-icons/fi';
import {Loader} from "semantic-ui-react";
const WarehouseForm = () => {
    const client = useClient();
    const params = useParams();
    const groups = useGroups();
    const [environmentOptions, setEnvironmentOptions] = useState([]);
    const [ready, setReady] = useState(false);
    const [errors, setErrors] = useState(null);
    const [backLink, setBackLink] = useState(null);
    const groupOptions = groups ? groups.map((g) => {
        return {value: g, foo: g, label: g}
    }) : [];
    const validationSchema = Yup.object().shape({
        label: Yup.string()
            .min(2, '*Cluster name must have at least 2 characters')
            .max(63, "*Cluster name can't be longer than 63 characters")
            .required('*Cluster name is required'),
        masterDatabaseName: Yup.string()
            .matches('^[a-zA-Z]*$', '*Database name is not valid (^[a-zA-Z]*$)')
            .min(2, '*Database name must have at least 2 characters')
            .max(60, "*Database name name can't be longer than 60 characters")
            .required('*Database name is required'),
        masterUsername: Yup.string()
            .matches('^[a-zA-Z]*$', '*Username is not valid (^[a-zA-Z]*$)')
            .min(2, '*Username name must have at least 2 characters')
            .max(60, "*Username name name can't be longer than 60 characters")
            .required('*Username name is required'),
        numberOfNodes: Yup.number()
            .required('*Number of nodes is required'),
        vpc: Yup.string()
            .matches('vpc-*', '*VPC Id is not valid')
            .required('*VPC Id is required'),
    });
    const clusterTypes = [{ label: 'single node', value: 'single-node' }, { label: 'multi node', value: 'multi-node' }];
    const nodeTypes = [
        { label: 'dc2.large', value: 'dc2.large' },
        { label: 'ds2.xlarge', value: 'ds2.xlarge' },
        { label: 'ds2.8xlarge', value: 'ds2.8xlarge' },
        { label: 'dc1.large', value: 'dc1.large' },
        { label: 'dc2.8xlarge', value: 'dc2.8xlarge' },
        { label: 'ra3.16xlarge', value: 'ra3.16xlarge' }
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


    const submitForm= async ({formData, success, fail}) => {

        let errors = [];
        await validationSchema.validate(formData).catch((err)=>{
            errors.push(err.errors)
        });

        if (errors.length > 0){
            fail({
                header: "Failed to create Redshift cluster",
                list: errors
            })
        }
        else {
            let input = {
                label: formData.label,
                description: formData.description,
                vpc: formData.vpc,
                tags: formData.tags,
                nodeType: formData.nodeType.value,
                masterDatabaseName: formData.masterDatabaseName,
                masterUsername: formData.masterUsername,
                numberOfNodes: parseInt(formData.numberOfNodes),
                SamlGroupName: formData.SamlGroupName ? formData.SamlGroupName.value : null,
                databaseName: formData.databaseName
            }
            console.log("input", input)
            const response = await client.mutate(createRedshiftCluster({
                environmentUri: formData.environment.environmentUri,
                input: input
            }));

            if (!response.errors) {
                success({
                    header: `Redshift Cluster ${formData.label}`,
                    content: `Created successfully ${response.data.createRedshiftCluster.clusterUri}`
                })
            } else {
                fail({
                    header: `Redshift Cluster ${formData.label}`,
                    content: `Failed to create Redshift Cluster due to: ${response.errors[0].message}`
                })
            }
        }
    };

    useEffect(()=>{
        if (client){
            setBackLink(params.uri ? {
                label: '< back to environment warehouses',
                link: `/environment/${params.uri}/warehouses`
            }: {
                label: '< back to warehouses',
                link: `/warehouses`
            });
            fetchEnvironments();
        }
    },[client]);

    return <CreateForm
        ready={ready}
        onSubmit={submitForm}
        breadcrumbs={`|warehouse/create`}
        backLink={backLink}
        icon={<FiIcon.FiBox/>}
        title={`Create Redshift Cluster`}
        submit={submitForm}
        initialValues={{
            label: '',
            description: '',
            nodeType: '',
            masterDatabaseName: '',
            masterUsername: '',
            databaseName: 'datahubdb',
            vpc: '',
            numberOfNodes: 2,
            clusterType: '',
            environment: {},
            SamlGroupName: '',
            tags: []
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
                        icon: 'globe',
                        value: resolveRegion
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
                type: FormFieldTypes.Input,
                required: true,
                label: 'Name',
                name: 'label',
                icon: 'info',
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
                label: 'VPC ID',
                name: 'vpc',
                placeholder: 'vpc-12345678012',
                required: true,
                icon: 'aws',

            },
            {
                items: [
                    {
                        type: FormFieldTypes.Select,
                        label: 'Node Type',
                        name: 'nodeType',
                        required: true,
                        options: nodeTypes,
                        width: 8,
                    },
                    {
                        type: FormFieldTypes.Input,
                        label: 'Number of Nodes',
                        name: 'numberOfNodes',
                        required: true,
                        width: 8,
                        icon: 'bars'
                    },

                ]
            },
            {
                items: [
                    {
                        type: FormFieldTypes.Input,
                        label: 'Master Username',
                        name: 'masterUsername',
                        required: true,
                        icon: 'user',
                    },
                    {
                        type: FormFieldTypes.Input,
                        label: 'Master Database',
                        name: 'masterDatabaseName',
                        required: true,
                        icon: 'database',
                    },
                    {
                        type: FormFieldTypes.Input,
                        required: true,
                        label: 'Database Name (DB used by Datahub)',
                        name: 'databaseName',
                        icon: 'database',
                    },
                ]
            },
            {
                type: FormFieldTypes.Select,
                required: true,
                label: 'Admins',
                name: 'SamlAdminGroupName',
                options: groupOptions,
                icon: 'people',
            },
            {
                type: FormFieldTypes.Tags,
                label: 'Tags',
                name: 'tags'
            }
        ]}
    />
};
export default WarehouseForm;
