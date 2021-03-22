import React, {useEffect, useState} from "react";
import {Link, useParams, useHistory} from "react-router-dom";
import ObjectView from "../../components/view/ObjectViewTemplate";
import useClient from "../../api/client";
import getCluster from '../../api/RedshiftCluster/getCluster';
import resumeRedshiftCluster from '../../api/RedshiftCluster/resumeCluster';
import pauseRedshiftCluster from '../../api/RedshiftCluster/pauseCluster';
import deleteRedshiftCluster from '../../api/RedshiftCluster/deleteCluster';
import getClusterConsoleAccess from '../../api/RedshiftCluster/getClusterConsoleAccess';
import * as FiIcon from 'react-icons/fi';
import {Button, Header, Message, Modal, Dropdown, Icon, Label} from "semantic-ui-react";
import * as ReactIf from "react-if";
import * as Components from "../Warehouses/components";
import Stack from "../Stack/Stack";

const WarehouseView = (props) => {

    const params = useParams();
    const client = useClient();
    const [loading, setLoading] = useState(true);
    let [error, setError] = useState(null);
    let [success, setSuccess] = useState(null);
    let [uiError, setUiError] = useState(null);
    const [warehouse, setWarehouse] = useState({})
    const [showPauseCluster, setShowPauseCluster] = useState(false);
    const [showResumeCluster, setShowResumeCluster] = useState(false);
    const [showDeleteCluster, setShowDeleteCluster] = useState(false);
    const [showDetachCluster, setShowDetachCluster] = useState(false);

    let history = useHistory();
    const [isLoadingUI, setIsLoadingUI] = useState(false);

    const goToConsole = async () => {
        setIsLoadingUI(true);
        const response = await client.query(getClusterConsoleAccess(warehouse.clusterUri));

        if (!response.errors) {
            window.open(response.data.getRedshiftClusterConsoleAccess, '_blank');
        } else {
            setUiError({
                header: `Jump to console Failed`,
                content: `${response.errors[0].message}`
            })
        }
        setIsLoadingUI(false);
    };

    const deleteCluster = async ()=>{
        const response = await client.mutate(deleteRedshiftCluster(warehouse.clusterUri));
        if (response.errors){
            setError({
                header: `Delete Failed`,
                content: `${response.errors[0].message}`
            })
        }
        else{
            history.push(`/environments`);
        }
    };

    const pauseCluster = async ()=>{
        const response = await client.mutate(pauseRedshiftCluster(warehouse.clusterUri));
        if (response.errors){
            setUiError({
                header: `Pause Failed`,
                content: `${response.errors[0].message}`
            })
        }
        else{
            await fetchItem();
            setSuccess({
                header: `Pause Started`,
                content: ``
            })
        }
        setShowPauseCluster(false)
    };
    const resumeCluster = async ()=>{
        const response = await client.mutate(resumeRedshiftCluster(warehouse.clusterUri));
        if (response.errors){
            setUiError({
                header: `Resume Failed`,
                content: `${response.errors[0].message}`
            })
        }
        else{
            await fetchItem();
            setSuccess({
                header: `Resume Started`,
                content: ``
            })
        }
        setShowResumeCluster(false)
    };

    const fetchItem = async () => {
        const response = await client.query(getCluster(params.uri));
        if (!response.errors) {
            setWarehouse(response.data.getRedshiftCluster);
        } else {
            setError({
                header: 'Error',
                content: `Could not retrieve Redshift Cluster ${params.uri}`
            })
        }
        setLoading(false);
    }

    useEffect(() => {
        if (client) {
            fetchItem();
        }
    }, [client]);

    const Actions = () => (
        <div>
            <Button.Group>
                <Button.Group color='blue'>
                    <Button loading={isLoadingUI} onClick={goToConsole}><FiIcon.FiBox/> Query Editor</Button>
                    <Dropdown.Divider />
                    <Dropdown
                        className='button icon'
                        options={[
                            { key: 'pause', text: <Button basic onClick={() => setShowPauseCluster(true)}>
                                    <Icon name='pause'/> Pause
                                </Button>, value: 'pause' },
                            { key: 'resume', text: <Button basic onClick={resumeCluster}>
                                    <Icon name='play'/> Resume
                                </Button>, value: 'resume' },
                            { key: 'delete', text: <Button basic onClick={() => setShowDeleteCluster(true)}>
                                    <Icon name='trash'/> Delete
                                </Button>, value: 'delete' },
                        ]}
                        trigger={<></>}
                    />
                </Button.Group>
            </Button.Group>
            <ReactIf.If condition={showPauseCluster}>
                <ReactIf.Then>
                    <Modal
                        centered={false}
                        onClose={() => setShowPauseCluster(false)}
                        onOpen={() => setShowPauseCluster(true)}
                        open={() => setShowPauseCluster(true)}
                        size='small'
                        trigger={<span/>}
                    >
                        <Modal.Content>
                            <Modal.Description>
                                <Header>Pause cluster {warehouse.label} ?</Header>
                                {error && <Message negative>
                                    <Message.Header>error.header</Message.Header>
                                    <p>{error && error.content}</p>
                                </Message>
                                }
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color={'grey'} basic onClick={() => setShowPauseCluster(false)}>
                                Cancel
                            </Button>
                            <Button
                                color={'red'}
                                basic
                                content="Pause"
                                labelPosition='left'
                                icon='pause'
                                onClick={pauseCluster}
                            />
                        </Modal.Actions>
                    </Modal>
                </ReactIf.Then>
            </ReactIf.If>
            <ReactIf.If condition={showDeleteCluster}>
                <ReactIf.Then>
                    <Modal
                        centered={false}
                        onClose={() => setShowDeleteCluster(false)}
                        onOpen={() => setShowDeleteCluster(true)}
                        open={() => setShowDeleteCluster(true)}
                        size='small'
                        trigger={<span/>}
                    >
                        <Modal.Content>
                            <Modal.Description>
                                <Header>Delete cluster {warehouse.label} ?</Header>
                                <p>
                                    Deleting the cluster may cause data loss. Please be sure that you have
                                    backed up your data !
                                </p>
                                {error && <Message negative>
                                    <Message.Header>error.header</Message.Header>
                                    <p>{error && error.content}</p>
                                </Message>
                                }
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color={'grey'} onClick={() => setShowDeleteCluster(false)}>
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

    );
    const actions = <Actions {...warehouse}/>
    const Messages = () => (
        <div>{uiError && <Message negative onDismiss={()=>{setUiError(null)}}>
                <Message.Header>{uiError.header}</Message.Header>
                <p>{uiError.content}</p>
            </Message>
        }
            {success && <Message positive onDismiss={()=>{setSuccess(null)}}>
                <Message.Header>{success.header}</Message.Header>
                <p>{success.content}</p>
            </Message>
            }
        </div>
    )
    const messages = <Messages/>
    const Status = () => (
        <Label tag style={{fontSize:'xx-small'}}>{warehouse.status.toUpperCase()}</Label>
    )
    const status = <Status {...warehouse}/>
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
    return <ObjectView
        loading={loading}
        back={{
            link: `/environment/${warehouse.environmentUri}/warehouses`,
            label: '< back to environment warehouses'
        }}
        title={warehouse.label}
        breadcrumbs={`/environment/${warehouse.environmentUri}/warehouses`}
        label={warehouse.label}
        owner={warehouse.owner}
        created={warehouse.created}
        icon={<FiIcon.FiBox/>}
        tabs={["Overview","Connection","Datasets","Stack"]}
        error={error}
        actions={actions}
        messages={messages}
        status={status}
    >
        <Components.Editor warehouse={{
            ...warehouse
        }} editable={isEditable(warehouse)}/>
        <Components.Connection warehouse={{
            ...warehouse
        }}/>
        <Components.ClusterDatasets warehouse={{
            ...warehouse
        }}/>
        <Stack stack={warehouse.stack} reload={fetchItem}/>

    </ObjectView>
}


export default WarehouseView;
