import React, {useEffect, useState} from "react";
import * as BsIcon from "react-icons/bs";
import * as SiIcon from 'react-icons/si';
import {Link, useParams} from "react-router-dom";
import ObjectView from "../../components/view/ObjectViewTemplate";
import * as Components from "./components";
import useClient from "../../api/client";
import getNotebook from "../../api/SagemakerNotebook/getSagemakerNotebook";
import Stack from "../Stack/Stack";
import {Button, Dropdown, Header, Icon, Label, Message, Modal} from "semantic-ui-react";
import * as ReactIf from "react-if";
import getSagemakerNotebookPresignedUrl from "../../api/SagemakerNotebook/getSagemakerNotebookPresignedUrl";
import stopSagemakerNotebook from "../../api/SagemakerNotebook/stopNotebookInstance";
import startSagemakerNotebook from "../../api/SagemakerNotebook/startNotebookInstance";

const NotebookView = (props) => {

    const params = useParams();
    const client = useClient();
    const [loading, setLoading] = useState(true);
    let [error, setError] = useState(null);
    const [notebook, setNotebook] = useState({})
    const [showStopInstance, setShowStopInstance] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [loadingUi, setLoadingUi] = useState(false)
    const [isStoppingNotebook, setIsStoppingNotebook] = useState(false);
    const [isStartingNotebook, setIsStartingNotebook]= useState(false);
    const [isOpeningJupyter, setIsOpeningJupyter]= useState(false);
    const [errors, setErrors]= useState(null);
    const [success, setSuccess]= useState(null);

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
            fetchItem();
            setSuccess({
                header: `Instance Stopping`,
                content: ``
            })
        }
        else{
            setErrors({
                header: `Stop Instance Failed`,
                content: `${response.errors[0].message}`
            })
        }
        setIsStoppingNotebook(false);
        setShowStopInstance(false)
    }

    const startThisNotebook = async()=>{
        setIsStartingNotebook(true);
        const response = await client.mutate(startSagemakerNotebook(notebook.notebookUri));
        if (!response.errors) {
            fetchItem();
            setSuccess({
                header: `Instance Starting`,
                content: ``
            })
        }
        else{
            setErrors({
                header: `Start Instance Failed`,
                content: `${response.errors[0].message}`
            })
        }
        setIsStartingNotebook(false);
    }

    const backLink = <Link to={`/notebooks`}>
        <small>{`<`} back to notebooks</small>
    </Link>


    const fetchItem = async () => {
        const response = await client.query(getNotebook(params.uri));
        if (!response.errors) {
            setNotebook(response.data.getSagemakerNotebook);
            setLoading(false);
        } else {
            setError({
                header: 'Error',
                content: `Could not retrieve notebook ${response.errors[0].messages}`
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
                    <Button loading={isOpeningJupyter} onClick={getThisNotebookPresignedUrl}><SiIcon.SiJupyter /> Jupyter Notebook</Button>
                    <Dropdown.Divider />
                    <Dropdown
                        className='button icon'
                        options={[
                            { key: 'play', text: <Button basic onClick={startThisNotebook} loading={isStartingNotebook}>
                                    <Icon name='play circle'/>
                                    Start
                                </Button>, value: 'play' },
                            { key: 'resume', text: <Button basic onClick={()=>setShowStopInstance(true)} loading={isStoppingNotebook}>
                                    <Icon name='stop circle'/>
                                    Stop
                                </Button>, value: 'resume' },
                            { key: 'delete', text: <Button basic onClick={()=>setShowDelete(true)}>
                                    <Icon name='trash'/>
                                    Delete
                                </Button>, value: 'delete' },
                        ]}
                        trigger={<></>}
                    />
                </Button.Group>
            </Button.Group>
            <ReactIf.If condition={showStopInstance}>
                <ReactIf.Then>
                    <Modal
                        centered={false}
                        onClose={() => setShowStopInstance(false)}
                        onOpen={() => setShowStopInstance(true)}
                        open={() => setShowStopInstance(true)}
                        size='small'
                        trigger={<span/>}
                    >
                        <Modal.Content>
                            <Modal.Description>
                                <Header>Stop SageMaker Instance {notebook.label} ?</Header>
                                {errors && <Message negative>
                                    <Message.Header>error.header</Message.Header>
                                    <p>{errors && errors.content}</p>
                                </Message>
                                }
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color={'grey'} basic onClick={() => setShowStopInstance(false)}>
                                Cancel
                            </Button>
                            <Button
                                color={'red'}
                                basic
                                content="Stop"
                                labelPosition='left'
                                icon='stop'
                                onClick={stopThisNotebook}
                            />
                        </Modal.Actions>
                    </Modal>
                </ReactIf.Then>
            </ReactIf.If>
            <ReactIf.If condition={showDelete}>
                <ReactIf.Then>
                    <Modal
                        centered={false}
                        onClose={() => setShowDelete(false)}
                        onOpen={() => setShowDelete(true)}
                        open={() => setShowDelete(true)}
                        size='small'
                        trigger={<span/>}
                    >
                        <Modal.Content>
                            <Modal.Description>
                                <Header>Delete SageMaker Instance {notebook.label} ?</Header>
                                <p>
                                    Make sure to save all your notebooks before deleting the instance
                                </p>
                                {error && <Message negative>
                                    <Message.Header>error.header</Message.Header>
                                    <p>{error && error.content}</p>
                                </Message>
                                }
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color={'grey'} onClick={() => setShowDelete(false)}>
                                Cancel
                            </Button>
                            <Button
                                color={'red'}
                                content="Confirm"
                                labelPosition='left'
                                icon='trash'
                                onClick={''}
                            />
                        </Modal.Actions>
                    </Modal>
                </ReactIf.Then>
            </ReactIf.If>
        </div>

    );
    const actions = <Actions {...notebook}/>
    const Messages = () => (
        <div>{errors && <Message negative onDismiss={()=>{setErrors(null)}}>
            <Message.Header>{errors.header}</Message.Header>
            <p>{errors.content}</p>
        </Message>
        }
            {success && <Message positive onDismiss={()=>{setSuccess(null)}}>
                <Message.Header>{success.header}</Message.Header>
                <p>{success.content}</p>
            </Message>
            }
        </div>
    )
    const messages = <Messages {...errors}/>
    const Status = () => (
        <Label tag style={{fontSize:'xx-small'}}>{notebook.NotebookInstanceStatus.toUpperCase()}</Label>
    )
    const status = <Status {...notebook}/>
    return <ObjectView
        loading={loading}
        title={notebook.label}
        back={{
            link: '/notebooks',
            label: '< back to notebooks'
        }}
        icon={<BsIcon.BsCode/>}
        breadcrumbs={`work/notebooks/${notebook.notebookUri}`}
        label={notebook.label}
        owner={notebook.owner}
        created={notebook.created}
        error={error}
        tabs={["Overview", "Instance", "Stack"]}
        actions={actions}
        messages={messages}
        status={status}
    >
        <Components.Editor notebook={{
            ...notebook
        }} editable={true}/>

        <Components.Settings notebook={notebook} editable={true} reloadNotebook={fetchItem}/>

        <Stack stack={notebook.stack} reload={fetchItem}/>
    </ObjectView>
}


export default NotebookView;
