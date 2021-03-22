import {useEffect, useState} from "react";
import {CreateForm, FormFieldTypes} from "../../components/form";
import * as BsIcon from "react-icons/bs";
import useGroups from "../../api/useGroups";
import useClient from "../../api/client";
import importDashboard from "../../api/Dashboard/importDashboard";
import listEnvironments from "../../api/Environment/listEnvironments";


const DashboardForm = () => {
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
        if (!formData.dashboardId)
            errors.push('Dashboard Id is mandatory')
        if (errors.length > 0){
            fail({
                header: "Failed",
                list: errors
            })
        }
        else {
            const response = await client.mutate(importDashboard({
                input: {
                    label: formData.label,
                    environmentUri: formData.environment.environmentUri,
                    tags: formData.tags,
                    dashboardId: formData.dashboardId,
                    description: formData.description,
                    SamlGroupName: formData.SamlGroupName ? formData.SamlGroupName.value: null,
                }
            }))
            if (!response.errors) {
                success({
                    header: `Success`,
                    content: `Successfully created dashboard ${response.data.importDashboard.dashboardUri}`
                })
            } else {
                fail({
                    header: "Failed",
                    content: `Could not create dashboard, received ${response.errors[0].message}`
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
        breadcrumbs={`| play/dashboard/import`}
        backLink={{
            label: '< back to dashboard list',
            link: '/dashboards'
        }}
        icon={<BsIcon.BsFileCode/>}
        title={`Import Dashboard`}
        initialValues={{
            label: 'xxx',
            description: '',
            dashboardId:'',
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
                label: 'Quicksight Dashboard Id',
                name: 'dashboardId',
                required: true,
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
export default DashboardForm;
