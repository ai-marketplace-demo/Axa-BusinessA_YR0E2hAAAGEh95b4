import React, {useEffect, useState} from "react";
import {Link, useParams, useHistory} from "react-router-dom";
import ObjectView from "../../components/view/ObjectViewTemplate";
import * as SiIcon from "react-icons/si";
import useClient from "../../api/client";
import getCluster from "../../api/AirflowCluster/getCluster";
import deleteAirflowCluster from "../../api/AirflowCluster/deleteCluster";
import getAirflowClusterWebLoginToken from "../../api/AirflowCluster/getClusterConsoleAccess";
import {Button, Header, Message, Modal, Dropdown, Label, Icon} from "semantic-ui-react";
import * as ReactIf from "react-if";
import * as Components from "../Workflows/components";
import Stack from "../Stack/Stack";

const WorkflowView = (props) => {

    const params = useParams();
    const client = useClient();
    const [loading, setLoading] = useState(true);
    let [error, setError] = useState(null);
    let [uiError, setUiError] = useState(null);
    const [workflow, setWorkflow] = useState({})
    const [showDeleteEnv, setShowDeleteEnv] = useState(false);

    let history = useHistory();
    const [isLoadingAirflowUI, setIsLoadingAirflowUI] = useState(false);

    const goToAirflowUI = async () => {
        setIsLoadingAirflowUI(true);
        const response = await client.query(getAirflowClusterWebLoginToken(workflow.clusterUri));

        if (!response.errors) {
            window.open(response.data.getAirflowClusterConsoleAccess, '_blank');
        } else {
            setUiError({
                header: `Airflow Environment ${workflow.label}`,
                content: `Failed to access Airflow UI due to: ${response.errors[0].message}`
            })
        }
        setIsLoadingAirflowUI(false);
    };

    const deleteCluster = async ()=>{
        const response = await client.mutate(deleteAirflowCluster(workflow.clusterUri));
        if (response.errors){
            setError({
                header: `Airflow Environment ${workflow.label}`,
                content: `Failed to delete Airflow environment due to: ${response.errors[0].message}`
            })
        }
        else{
            history.push(`/workflows`);
        }
    };


    const fetchItem = async () => {
        const response = await client.query(getCluster(params.uri));
        if (!response.errors) {
            setWorkflow(response.data.getAirflowCluster);
            setLoading(false);
        } else {
            setError({
                header: 'Error',
                content: `Could not retrieve Airflow Environment ${params.uri}`
            })
        }
        setLoading(false);
    }

    useEffect(() => {
        if (client) {
            fetchItem();
        }
    }, [client]);

    const isAdmin = (d) => {
        if (!d) {
            return false
        } else {
            if (["Creator", "Admin", "Owner"].indexOf(d.userRoleForCluster) != -1) {
                return true
            } else {
                return false
            }
        }
    }

    const Actions = () => (
        <ReactIf.If condition={isAdmin(workflow)}>
            <ReactIf.Then>
                <div>
                    <Button.Group>
                        <Button.Group color='blue'>
                            <Button loading={isLoadingAirflowUI} onClick={goToAirflowUI}><SiIcon.SiApacheairflow/>  Airflow</Button>
                            <Dropdown.Divider />
                            <Dropdown
                                className='button icon'
                                options={[
                                    { key: 'delete', text: <Button basic onClick={() => setShowDeleteEnv(true)}>
                                            <Icon name='trash'/> Delete
                                        </Button>, value: 'delete' },
                                ]}
                                trigger={<></>}
                            />
                        </Button.Group>
                    </Button.Group>
                    <ReactIf.If condition={showDeleteEnv}>
                        <ReactIf.Then>
                            <Modal
                                centered={false}
                                onClose={() => setShowDeleteEnv(false)}
                                onOpen={() => setShowDeleteEnv(true)}
                                open={() => setShowDeleteEnv(true)}
                                size='small'
                                trigger={<span/>}
                            >
                                <Modal.Content>
                                    <Modal.Description>
                                        <Header>Delete environment {workflow.label} ?</Header>
                                        <p>
                                            You must first delete all objects linked to this Airflow environment !
                                        </p>
                                        {error && <Message negative>
                                            <Message.Header>error.header</Message.Header>
                                            <p>{error && error.content}</p>
                                        </Message>
                                        }
                                    </Modal.Description>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button color={'grey'} onClick={() => setShowDeleteEnv(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        color={'red'}
                                        content="Confirm"
                                        labelPosition='left'
                                        icon='trash'
                                        onClick={deleteCluster}
                                    />
                                </Modal.Actions>
                            </Modal>
                        </ReactIf.Then>
                    </ReactIf.If>
                </div>
            </ReactIf.Then>
        </ReactIf.If>

    );
    const actions = <Actions {...workflow}/>
    const isEditable = (w) => {
        if (!w) {
            return false
        } else {
            if (["Creator", "Admin", "Owner"].indexOf(w.userRoleForCluster) != -1) {
                return true
            } else {
                return false
            }
        }

    }
    const Messages = () => (
        <div>{uiError && <Message negative onDismiss={()=>{setUiError(null)}}>
            <Message.Header>{uiError.header}</Message.Header>
            <p>{uiError.content}</p>
        </Message>
        }
        </div>
    )
    const Status = () => (
        <Label tag style={{fontSize:'xx-small'}}>{workflow.status.toUpperCase()}</Label>
    )
    return <ObjectView
        loading={loading}
        title={workflow.label}
        back={{
            link: '/workflows',
            label: '< back to workflows'
        }}
        icon={<SiIcon.SiApacheairflow/>}
        breadcrumbs={`play/workflows/${workflow.clusterUri}`}
        label={workflow.label}
        owner={workflow.owner}
        created={workflow.created}
        tabs={["Overview", "Projects", "Stack"]}
        actions={actions}
        status={<Status/>}
        messages={<Messages/>}
    >
        <Components.Editor workflow={{
            ...workflow
        }} editable={isEditable(workflow)}/>

        <Components.ProjectList workflow={{
            ...workflow
        }} editable={isEditable(workflow)}/>
        <Stack stack={workflow.stack} reload={fetchItem}/>

    </ObjectView>
}


export default WorkflowView;
