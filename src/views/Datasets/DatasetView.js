import React, {useEffect, useState} from "react";
import * as BsIcon from "react-icons/bs";
import {Link, useParams, useHistory} from "react-router-dom";
import ObjectView from "../../components/view/ObjectViewTemplate";
import * as Components from "./components";
import useClient from "../../api/client";
import getDataset from "../../api/Dataset/getDataset";
import deleteDataset from '../../api/Dataset/deleteDataset';
import archiveDataset from '../../api/Dataset/archiveDataset';
import updateDatasetStack from '../../api/Dataset/updateDatasetStack';
import getDatasetAdminConsoleUrl from '../../api/Dataset/getDatasetAdminConsoleUrl';
import generateDatasetAccessToken from '../../api/Dataset/generateDatasetAccessToken';
import Stack from "../Stack/Stack";
import {Button, Dropdown, Header, Icon, Label, Message, Modal, Form} from "semantic-ui-react";
import * as ReactIf from "react-if";

const DatasetView = (props) => {

    const params = useParams();
    const client = useClient();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    let [error, setError] = useState(null);
    const [dataset, setDataset] = useState({})
    let [uiError, setUiError] = useState(null);
    const [showDeleteDataset, setShowDeleteDataset] = useState(false);
    const [showArchiveDataset, setShowArchiveDataset] = useState(false);
    const [showCreds, setShowCreds] = useState(false);
    const [credentials, setCredentials] = useState(null);
    const [isLoadingUI, setIsLoadingUI] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loadingCreds, setLoadingCreds] = useState(false);
    const backLink = <Link to={`/datasets`}>
        <small>{`<`} back to datasets</small>
    </Link>


    const fetchItem = async () => {
        const response = await client.query(getDataset(params.uri));
        if (!response.errors) {
            setDataset(response.data.getDataset);
            setLoading(false);
        } else {
            setError({
                header: 'Error',
                content: `Could not retrieve dataset ${params.uri}`
            })
        }
        setLoading(false);
    }
    const storeDataset = async () => {
        const response = await client.mutate(archiveDataset(dataset.datasetUri));
        if (!response.errors) {
            history.push(`/datasets`)
        } else {
            setError({
                header: 'Error',
                content: `Could not archive dataset ${params.uri}`
            })
        }
    };

    const removeDataset = async () => {
        const response = await client.mutate(deleteDataset(dataset.datasetUri));
        if (!response.errors) {
            history.push(`/datasets`)
        } else {
            setError({
                header: 'Error',
                content: `Could not archive dataset ${params.uri}`
            })
        }
    };

    const goToS3Console = async () => {
        setIsLoadingUI(true);
        const response = await client.query(getDatasetAdminConsoleUrl(dataset.datasetUri));
        if (!response.errors) {
            window.open(response.data.getDatasetAssumeRoleUrl, '_blank');
        } else {
            setUiError({
                header: 'Error accessing S3 console',
                content: `${response.errors[0].message}`
            })
        }
        setIsLoadingUI(false);
    };

    const generateCredentials = async () => {
        setLoadingCreds(true);
        const response = await client.mutate(generateDatasetAccessToken(dataset.datasetUri));
        if (!response.errors) {
            setCredentials({
                header: 'Dataset Credentials',
                content: `${response.data.generateDatasetAccessToken}`
            });
        } else {
            setUiError({
                header: 'Error generating dataset credentials',
                content: `${response.errors[0].message}`
            })
        }
        setLoadingCreds(false);
        setShowCreds(true);
    };

    const updateStack = async () => {
        const response = await client.mutate(updateDatasetStack(dataset.datasetUri));
        if (!response.errors) {
            setSuccess({
                content: `CloudFormation stack stack-${dataset.stack.stackUri} update started`,
            })
            await fetchItem()
        } else {
            setUiError({
                header: 'Error updating dataset stack',
                content: `${response.errors[0].message}`
            })
        }
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
            if (["Creator", "Admin", "Owner"].indexOf(d.userRoleForDataset) != -1) {
                return true
            } else {
                return false
            }
        }

    }

    const Actions = () => (
        <ReactIf.If condition={isAdmin(dataset)}>
            <ReactIf.Then>
                <div>
                <Button.Group>
                    <Button.Group color='blue'>
                        <Button size='small' onClick={goToS3Console} loading={isLoadingUI}
                                icon labelPosition='left'>
                            <Icon name='external alternate'/>
                            S3 Bucket
                        </Button>
                        <Dropdown.Divider />
                        <Dropdown
                            className='button icon'
                            options={[
                                { key: 'credentials', text: <Button loading={loadingCreds} basic onClick={generateCredentials}>
                                        <Icon name={'file alternate'}/> Credentials
                                    </Button>, value: 'credentials' },
                                { key: 'archive', text: <Button basic onClick={() => setShowArchiveDataset(true)}>
                                        <Icon name={'archive'}/> Archive
                                    </Button>, value: 'archive' },
                                { key: 'delete', text: <Button basic onClick={() => setShowDeleteDataset(true)}>
                                        <Icon name={'trash'}/> Delete
                                    </Button>, value: 'delete' },
                            ]}
                            trigger={<></>}
                        />
                    </Button.Group>
                </Button.Group>
                <ReactIf.If condition={showCreds}>
                    <ReactIf.Then>
                        <Modal
                            centered={false}
                            onClose={() => setShowCreds(false)}
                            onOpen={() => setShowCreds(true)}
                            open={() => setShowCreds(true)}
                            size='small'
                            trigger={<span/>}
                        >
                            <Modal.Header>{credentials?.header}</Modal.Header>
                            <Modal.Content>
                                <Form>
                                    <Form.Field>
                                        <textarea value={credentials?.content}/>
                                    </Form.Field>
                                </Form>
                            </Modal.Content>
                        </Modal>
                    </ReactIf.Then>
                </ReactIf.If>
                <ReactIf.If condition={showArchiveDataset}>
                    <ReactIf.Then>
                        <Modal
                            centered={false}
                            onClose={() => setShowArchiveDataset(false)}
                            onOpen={() => setShowArchiveDataset(true)}
                            open={() => setShowArchiveDataset(true)}
                            size='small'
                            trigger={<span/>}
                        >
                            <Modal.Content>
                                <Modal.Description>
                                    <Header>Archive dataset {dataset.label} ?</Header>
                                    <p>
                                        Archiving a dataset will remove it from the Catalog but still available on AWS !
                                    </p>
                                </Modal.Description>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color={'grey'} basic onClick={() => setShowArchiveDataset(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    color={'red'}
                                    basic
                                    content="Archive"
                                    labelPosition='left'
                                    icon='archive'
                                    onClick={storeDataset}
                                />
                            </Modal.Actions>
                        </Modal>
                    </ReactIf.Then>
                </ReactIf.If>
                <ReactIf.If condition={showDeleteDataset}>
                    <ReactIf.Then>
                        <Modal
                            centered={false}
                            onClose={() => setShowDeleteDataset(false)}
                            onOpen={() => setShowDeleteDataset(true)}
                            open={() => setShowDeleteDataset(true)}
                            size='small'
                            trigger={<span/>}
                        >
                            <Modal.Content>
                                <Modal.Description>
                                    <Header>Delete dataset {dataset.label} ?</Header>
                                    <p>
                                        Delete action will destroy all AWS resources linked to your dataset
                                        (S3 bucket, IAM role...)!
                                    </p>
                                </Modal.Description>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color={'grey'} basic onClick={() => setShowDeleteDataset(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    color={'red'}
                                    content='Delete'
                                    labelPosition='left'
                                    icon='trash'
                                    onClick={removeDataset}
                                />
                            </Modal.Actions>
                        </Modal>
                    </ReactIf.Then>
                </ReactIf.If>
            </div>
            </ReactIf.Then>
        </ReactIf.If>


    );
    const actions = <Actions {...dataset}/>
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
    const Status = () => (
        <Label tag style={{fontSize:'xx-small'}}>{dataset.stack.status.toUpperCase()}</Label>
    )


    return <ObjectView
        loading={loading}
        title={dataset.label}
        back={{
            link: '/datasets',
            label: '< back to datasets'
        }}
        icon={<BsIcon.BsFolder/>}
        breadcrumbs={`catalog/datasets/${dataset.datasetUri}`}
        label={dataset.label}
        error={error}
        owner={dataset.owner}
        created={dataset.created}
        tabs={["overview",  "schema","tables", "folders", "permissions", "upload", "stack"]}
        actions={actions}
        messages={<Messages/>}
        status={<Status/>}
    >

        <Components.Editor
            client={client}
            dataset={{
                ...dataset,
                topics: dataset.topics && dataset.topics.map((t) => {
                    return {label: t, value: t}
                }),
                terms:dataset.terms&&dataset.terms.count&&dataset.terms.nodes||[]
        }} editable={true}/>
        <Components.SchemaViewer dataset={dataset} client={client}/>
        <Components.TableList dataset={dataset}/>
        <Components.FolderList dataset={dataset}/>
        <Components.PermissionList dataset={dataset}/>
        <Components.Uploader dataset={dataset} client={client}/>
        {isAdmin(dataset) ?
            <Stack stack={dataset.stack} reload={fetchItem} update={updateStack}/>: <div></div>
        }
    </ObjectView>
}


export default DatasetView;
