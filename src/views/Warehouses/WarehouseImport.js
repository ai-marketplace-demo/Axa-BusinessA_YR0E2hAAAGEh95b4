import React, {useState, useEffect}  from "react";
import {CreateForm, FormFieldTypes} from "../../components/form";
import {useParams} from "react-router-dom";
import useClient from "../../api/client";
import listEnvironments from "../../api/Environment/listEnvironments";
import useGroups from "../../api/useGroups";
import * as Yup from 'yup';
import * as FiIcon from 'react-icons/fi';
import {Loader} from "semantic-ui-react";
import importRedshiftCluster from "../../api/RedshiftCluster/importCluster";

const WarehouseImport = () => {
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
        clusterIdentifier: Yup.string()
            .min(2, '*Cluster name must have at least 2 characters')
            .max(63, "*Cluster name can't be longer than 63 characters")
            .required('*Cluster name is required'),
    });

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
        const response = await client.query(listEnvironments({filter: {roles: ["Admin", "Owner"]}}));
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
                header: "Form Errors",
                list: errors
            })
        }
        else {
            let input = {
                label: formData.label,
                clusterIdentifier: formData.clusterIdentifier,
                description: formData.description,
                tags: formData.tags,
                databaseName: formData.databaseName
            }
            const response = await client.mutate(importRedshiftCluster({
                environmentUri : formData.environment.environmentUri,
                input:input
            }));

            if (!response.errors) {
                success({
                    header: `Redshift Cluster ${formData.label}`,
                    content: `Imported successfully ${response.data.importRedshiftCluster.clusterUri}`
                })
            } else {
                fail({
                    header: `Redshift Cluster ${formData.label}`,
                    content: `Failed to import Redshift Cluster due to: ${response.errors[0].message}`
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
        breadcrumbs={`|Warehouses/Import`}
        backLink={backLink}
        icon={<FiIcon.FiBox/>}
        title={`Import Redshift Cluster`}
        submit={submitForm}
        initialValues={{
            label: '',
            description: '',
            clusterIdentifier: '',
            databaseName: 'datahubdb',
            environment: {},
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
                        icon: 'cloud',
                        options: environmentOptions
                    },
                    {
                        type: FormFieldTypes.Input,
                        label: 'Region',
                        name: 'region',
                        width: '6',
                        readOnly: true,
                        icon: "globe",
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
                type: FormFieldTypes.Input,
                required: true,
                label: 'Amazon Redshift cluster identifier',
                name: 'clusterIdentifier',
                icon: 'aws',
            },
            {
                type: FormFieldTypes.Input,
                required: true,
                label: 'Database Name (DB used by Datahub)',
                name: 'databaseName',
                icon: 'database',
            },
            {
                type: FormFieldTypes.TextArea,
                required: true,
                label: 'Description',
                name: 'description',
                width: 16,
            },
            {
                type: FormFieldTypes.Tags,
                label: 'Tags',
                name: 'tags'
            }
        ]}
    />
};
export default WarehouseImport;
