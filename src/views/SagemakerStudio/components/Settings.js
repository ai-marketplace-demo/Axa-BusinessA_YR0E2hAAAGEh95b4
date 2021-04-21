
import useClient from "../../../api/client";
import {useState} from "react";
import {Button, Icon, Divider,Grid,Container, Label} from "semantic-ui-react";
import * as Form from "../../../components/form";
import FormFieldTypes from "../../../components/form/FormFieldTypes";
import getSagemakerStudioUserProfilePresignedUrl
    from "../../../api/SagemakerStudio/getSagemakerStudioUserProfilePresignedUrl";

const Settings = ({SagemakerStudioUserProfile, reloadSagemakerStudioUserProfile, editable}) => {
    const client = useClient();
    const [isOpeningJupyter, setIsOpeningJupyter]= useState(false);
    const [errors, setErrors]= useState(null);

    const getThisSagemakerStudioUserProfilePresignedUrl = async () => {
        setIsOpeningJupyter(true);
        const response = await client.query(getSagemakerStudioUserProfilePresignedUrl(SagemakerStudioUserProfile.sagemakerStudioUserProfileUri))
        if (!response.errors) {
            window.open(response.data.getSagemakerStudioUserProfilePresignedUrl)
        } else {
            setErrors(response.errors)
        }
        setIsOpeningJupyter(false);

    }

    const resolveEnvironment = (formData) => {
        if (formData) {
            return formData.environment.label;
        } else {
            return "";
        }
    }

    const resolveRegion = (formData) => {
        if (formData.environment && formData.environment.region) {
            return formData.environment.region
        } else {
            return ""
        }
    }
    const resolveStackName = (formData) => {
        if (formData) {
            return `stack-${formData.stack&&formData.stack.stackUri}`;
        } else {
            return "";
        }
    }
    const resolveStackStatus = (formData) => {
        if (formData.stack) {
            return formData.stack&&formData.stack.status
        } else {
            return ""
        }
    }
    const resolveExecutionRole = (formData) => {
        return formData.environment.EnvironmentDefaultIAMRoleArn
    }
    const resolveUserProfileStatus = (formData) => {
        return formData.sagemakerStudioUserProfileStatus
    }

    return <div>
        <div>

            <Button size='small' name={`url`} onClick={getThisSagemakerStudioUserProfilePresignedUrl} disabled={!editable} loading={isOpeningJupyter}
                    icon labelPosition='left'>
                <Icon name='linkify'/>
                Open Sagemaker Studio
            </Button>

        </div>
        <Divider hidden/>
        <Form.EditForm
            onSubmit={()=>{}}
            editable={()=>{}}
            initialValues={
                {...SagemakerStudioUserProfile}
            }

            fields={[
                {
                    items: [
                        {
                            type: FormFieldTypes.Input,
                            label: 'Execution Role',
                            name: 'Execution Role',
                            value: resolveExecutionRole,
                            readOnly: true,
                            icon: 'boxes'
                        },
                        {
                            type: FormFieldTypes.Input,
                            label: 'User Profile Status',
                            name: 'SagemakerStudioUserProfileStatus',
                            value: resolveUserProfileStatus,
                            readOnly: true,
                            icon: 'toggle on'
                        },
                    ]
                },

                {
                    items: [
                        {
                            type: FormFieldTypes.Input,
                            label: 'Environment',
                            value: resolveEnvironment,
                            readOnly: true,
                            icon: 'cloud'
                        },
                        {
                            type: FormFieldTypes.Input,
                            label: 'Region',
                            name: 'region',
                            readOnly: true,
                            value: resolveRegion,
                            icon: 'globe'
                        },
                    ]
                }
            ]}
        />
    </div>
}

export default Settings;
