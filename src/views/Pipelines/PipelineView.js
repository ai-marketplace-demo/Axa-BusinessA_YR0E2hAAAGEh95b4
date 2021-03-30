import React ,{useState, useEffect} from "react";
import * as BsIcon from "react-icons/bs";
import ObjectView from "../../components/view/ObjectViewTemplate";
import * as Components from "./components";
import useClient from "../../api/client";
import getSqlPipeline from "../../api/SqlPipeline/getSqlPipeline";
import {useParams, useHistory} from "react-router-dom";
import Stack from "../Stack/Stack";
import startDataProcessingPipeline from "../../api/SqlPipeline/startPipeline";
import deleteSqlPipeline from "../../api/SqlPipeline/deleteSqlPipeline";
import {Button, Dropdown, Header, Icon, Label, Message, Modal} from "semantic-ui-react";
import * as ReactIf from "react-if";


const PipelineView = (props) => {
    const client = useClient();
    const params= useParams();
    const history= useHistory();
    let [error, setError] = useState(null);
    let [runError, setRunError] = useState(null);
    let [success, setSuccess] = useState(null);
    const [pipeline, setPipeline] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting]=useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const fetchItem= async()=>{
        setLoading(true);
        const response = await client.query(getSqlPipeline(params.uri));
        if (!response.errors){
            setPipeline(response.data.getSqlPipeline);
        }else {
            setError({
                header: 'Error',
                content: `Could not retrieve dataset ${params.uri}`
            })
        }
        setLoading(false);
    }
    const runPipeline = async()=>{
        setIsSubmitting(true);
        const response= await client.mutate(startDataProcessingPipeline(pipeline.sqlPipelineUri));
        if (!response.errors){
            setSuccess({header:'Started',content:"Successfully started pipeline"});
        }else {
            setRunError({header:'Failed',content:`Failed starting  pipeline, received ${response.errors[0].message}`});
        }
        setIsSubmitting(false);

    }
    const deletePipeline = async()=>{
        setShowDelete(true);
        const response= await client.mutate(deleteSqlPipeline({sqlPipelineUri: pipeline.sqlPipelineUri}));
        if (!response.errors){
            history.push("/pipelines")
        }else {
            setRunError({header:'Failed',content:`Failed to delete pipeline, received ${response.errors[0].message}`});
        }
        setShowDelete(false);
    }
    useEffect(()=>{
        if (client){
            fetchItem();
        }
    },[client]);
    const Actions = () => (
        <div>
            <Button.Group>
                <Button.Group color='blue'>
                    <Button loading={isSubmitting} onClick={runPipeline}><Icon name={'play circle outline'}/> Start Run</Button>
                    <Dropdown.Divider />
                    <Dropdown
                        className='button icon'
                        options={[
                            { key: 'delete', text: <Button basic onClick={() => setShowDelete(true)}>
                                    <Icon name='trash'/> Delete
                                </Button>, value: 'delete' },
                        ]}
                        trigger={<></>}
                    />
                </Button.Group>
            </Button.Group>
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
                                <Header>Delete pipeline {pipeline.label} ?</Header>
                                <p>
                                    Deleting the pipeline will delete all its related AWS resources
                                    (CodeCommit, CodePipeline, StepFunctions...) !
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
                                onClick={deletePipeline}
                            />
                        </Modal.Actions>
                    </Modal>
                </ReactIf.Then>
            </ReactIf.If>
        </div>

    );
    const actions = <Actions {...pipeline}/>
    const Messages = () => (
        <div>{runError && <Message negative onDismiss={()=>{setRunError(null)}}>
            <Message.Header>{runError.header}</Message.Header>
            <p>{runError.content}</p>
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
        <Label tag style={{fontSize:'xx-small'}}>{pipeline.runs[0]?.jobRunState.toUpperCase() || pipeline.stack?.status}</Label>
    )


    return <ObjectView
        title={pipeline.label}
        loading={loading}
        icon={<BsIcon.BsFileCode/>}
        breadcrumbs={`| play/pipelines/pipeline`}
        label={pipeline.label}
        back={{
            link: '/pipelines',
            label: '< back to pipelines'
        }}
        owner={pipeline.owner}
        tabs={["overview", "code", "run","models", "stack"]}
        messages={messages}
        status={<Status/>}
        actions={actions}
    >
        <Components.Editor client={client} pipeline={pipeline}/>
        <Components.CodeCommitCredentialProvider client={client} pipeline={pipeline}/>
        <Components.PipelineExecutions client={client} pipeline={pipeline}/>
        <Components.ModelRegistry client={client} pipeline={pipeline}/>
        <Stack stack={pipeline.stack} reload={fetchItem}/>
    </ObjectView>
}


export default PipelineView;
