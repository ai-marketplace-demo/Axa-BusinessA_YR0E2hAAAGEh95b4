import React, { useState, useEffect } from 'react';
import {CreateForm, FormFieldTypes} from "../../components/form";
import * as BsIcon from "react-icons/bs";
import useGroups from "../../api/useGroups";
import useClient from "../../api/client";
import {useParams} from "react-router-dom";
import {AwsRegions} from "../../components/regions";
import createEnvironment from "../../api/Environment/createEnvironment";
import {Message} from "semantic-ui-react";
import getTrustAccount from '../../api/Environment/getTrustAccount';

const EnvironmentForm = () => {
    const params = useParams();
    const client = useClient();
    const groups = useGroups();
    const groupOptions = groups ? groups.map((g) => {
        return {value: g, foo: g, label: g}
    }) : [];
    const [formData, setFormData] = useState({
        label: 'My new environment',
        description: 'Describe Environment',
        SamlGroupName: groupOptions[0],
        tags: [],
    })

    const [trustAwsAccountId, setTrustAwsAccountId] = useState('111111111111');

    const getTrustAwsAccountId = async () => {
        const response = await client.query(getTrustAccount());
        if (!response.errors) {
            setTrustAwsAccountId(response.data.getTrustAccount);
        }
    };
    useEffect(() => {
        if (client) {
            getTrustAwsAccountId();
        }
    }, [client]);
    const submitForm = async ({formData, success, fail}) => {
        let errors = [];
        if (!formData.AwsAccountId)
            errors.push('AWS account is mandatory')
        if (!formData.label)
            errors.push('Name is mandatory')
        if (!formData.region)
            errors.push('Region is mandatory')


        if (errors.length > 0){
            fail({
                header: "Failed",
                list: errors
            })
        }

        else {
            const response = await client.mutate(createEnvironment({
                organizationUri: params.uri,
                AwsAccountId: formData.AwsAccountId,
                label: formData.label,
                SamlGroupName: formData.SamlGroupName ? formData.SamlGroupName.value: null,
                tags: formData.tags,
                description: formData.description,
                region: formData.region.value
            }))

            if (!response.errors) {
                success({
                    header: `Success`,
                    content: `Successfully created environment with id ${response.data.createEnvironment.environmentUri}`
                })
            } else {
                fail({
                    header: "Error",
                    content: `Could not create environment, received ${response.errors[0].message}`
                })
            }
        }
    }
    const Messages = () => (
        <Message>
            <Message.Header>Before linking an AWS account and region to Datahub, please make sure:</Message.Header>
            <Message.List>
                <Message.Item>You have bootsraped your account using the <a href={'https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_install'}> aws cdk cli</a> running the command : <code>
                    <b>cdk bootstrap  --trust {trustAwsAccountId} -c @aws-cdk/core:newStyleStackSynthesis=true --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess aws://{formData.AwsAccountId || 'AWS_ACCOUNT_ID'}/{formData.region ? formData.region.value : 'REGION'}</b>
                </code></Message.Item>
                <Message.Item>You have created an IAM Role called <b>datahubPivotRole</b> on your account</Message.Item>
                <Message.Item>The IAM role datahubPivotRole must trust the account <code><b>{trustAwsAccountId}</b></code></Message.Item>
            </Message.List>
        </Message>
    )
    const messages = <Messages/>
    return <div>
        <CreateForm
        ready={true}
        onSubmit={submitForm}
        breadcrumbs={`| onboard/organization/environments.create`}

        backLink={{
            label: '< back to environments',
            link: `/environments/${params.uri}`
        }}
        icon={<BsIcon.BsCloud/>}
        title={`Link  Environment`}
        initialValues={formData}
        messages={messages}
        fields={[
            {
                type: FormFieldTypes.Input,
                label: 'Name',
                name: 'label',

                required: true,
            },
            {
                type: FormFieldTypes.TextArea,
                label: 'Description',
                name: 'description',
                width: 16,
            },
            {
                items: [
                    {
                        type: FormFieldTypes.Input,
                        label: 'AWS Account',
                        name: 'AwsAccountId',
                        width: "8",
                        required: true,
                    },
                    {
                        type: FormFieldTypes.Select,
                        width: "8",
                        label: 'Region',
                        name: 'region',
                        required: true,
                        options: AwsRegions
                    }
                ]
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
    /></div>
}
export default EnvironmentForm;
