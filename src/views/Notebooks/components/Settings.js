import getSagemakerNotebookPresignedUrl from "../../../api/SagemakerNotebook/getSagemakerNotebookPresignedUrl";
import stopSagemakerNotebook from "../../../api/SagemakerNotebook/stopNotebookInstance";
import startSagemakerNotebook from "../../../api/SagemakerNotebook/startNotebookInstance";
import useClient from "../../../api/client";
import {useState} from "react";
import {Button, Icon, Divider,Grid,Container, Label} from "semantic-ui-react";
import * as Form from "../../../components/form";
import FormFieldTypes from "../../../components/form/FormFieldTypes";

const Settings = ({notebook, reloadNotebook, editable}) => {
    const client = useClient();
    const [isStoppingNotebook, setIsStoppingNotebook] = useState(false);
    const [isStartingNotebook, setIsStartingNotebook]= useState(false);
    const [isOpeningJupyter, setIsOpeningJupyter]= useState(false);
    const [errors, setErrors]= useState(null);

    const getThisNotebookPresignedUrl = async()=>{
        setIsOpeningJupyter(true);
        const response = await client.query(getSagemakerNotebookPresignedUrl(notebook.notebookUri))
        if (!response.errors){
            window.open(response.data.getSagemakerNotebookPresignedUrl)
        }
        else{
            setErrors(response.errors)
        }
        setIsOpeningJupyter(false);

    }
    const stopThisNotebook = async()=>{
        setIsStoppingNotebook(true);
        const response = await client.mutate(stopSagemakerNotebook(notebook.notebookUri));
        if (!response.errors){
            reloadNotebook();
        }
        else{
            setErrors(response.errors)
        }
        setIsStoppingNotebook(false);
    }

    const startThisNotebook = async()=>{
        setIsStartingNotebook(true);
        const response = await client.mutate(startSagemakerNotebook(notebook.notebookUri));
        if (!response.errors) {
            reloadNotebook();
        }
        else{
            setErrors(response.errors)
        }
        setIsStartingNotebook(false);
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
    const resolveInstanceType = (formData) => {
        return "ml.t3.medium"
    }

    return <div>
        <div>
            <Button size='small' name={`url`} onClick={startThisNotebook} disabled={!editable} loading={isStartingNotebook}
                    icon labelPosition='left'>
                <Icon name='play circle'/>
                Start Instance
            </Button>
            <Button size='small' name={`url`} onClick={getThisNotebookPresignedUrl} disabled={!editable} loading={isOpeningJupyter}
                    icon labelPosition='left'>
                <Icon name='linkify'/>
                Open Jupyter
            </Button>
            <Button size='small' name={`url`} onClick={stopThisNotebook} disabled={!editable} loading={isStoppingNotebook}
                    icon labelPosition='left'>
                <Icon name='stop circle'/>
                Stop Instance
            </Button></div>
        <Divider hidden/>
        <Form.EditForm
            onSubmit={()=>{}}
            editable={()=>{}}
            initialValues={
                {...notebook}
            }

            fields={[
                {
                    items: [
                        {
                            type: FormFieldTypes.Input,
                            label: 'Instance Type',
                            name: 'NotebookInstanceType',
                            value: resolveInstanceType,
                            readOnly: true,
                            icon: 'boxes'
                        },
                        {
                            type: FormFieldTypes.Input,
                            label: 'Instance Status',
                            name: 'NotebookInstanceStatus',
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
