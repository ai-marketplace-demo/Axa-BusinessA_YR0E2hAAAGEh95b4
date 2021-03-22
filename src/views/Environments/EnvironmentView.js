import React, {useEffect, useState} from "react";
import * as BsIcon from "react-icons/bs";
import ObjectView from "../../components/view/ObjectViewTemplate";
import {useParams, useHistory} from "react-router-dom";
import * as Components from "./components";
import useClient from "../../api/client";
import getEnvironment from "../../api/Environment/getEnvironment";
import archiveEnvironment from "../../api/Environment/archiveEnvironment";
import {Button, Header, Label, Message, Modal} from "semantic-ui-react";
import * as ReactIf from "react-if";
import Stack from "../Stack/Stack"

const EnvironmentView = (props) => {
    const params = useParams();
    const history = useHistory();
    const client = useClient();
    const [loading, setLoading] = useState(true);
    let [error, setError] = useState(null);
    const [env, setEnv] = useState({});
    const [showDeleteEnv, setShowDeleteEnv] = useState(false);

    console.log("params .uri", params.uri);
    const fetchItem = async () => {
        const response = await client.query(getEnvironment({environmentUri: params.uri}));
        if (!response.errors) {
            setEnv(response.data.getEnvironment);
            setLoading(false);
        } else {
            setError({
                header: 'Error',
                content: `Could not retrieve environment ${params.uri}`
            })
        }
        setLoading(false);
    }
    const archiveEnv = async () => {
        const response = await client.mutate(archiveEnvironment(env.environmentUri));
        if (!response.errors) {
            history.push('/environments')
        } else {
            setError({
                header: 'Error',
                content: `Could not archive environment ${params.uri}`
            })
        }
    };


    useEffect(() => {
        if (client) {
            fetchItem();
        }
    }, [client]);

    const Actions = (env) => (
        <div>
            <Button.Group>
                <Button color={'blue'} basic onClick={() => setShowDeleteEnv(true)}>Delete</Button>
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
                                <Header>Archive environment {env.label} ?</Header>
                                <p>
                                    You must first delete all objects linked to this environment !
                                </p>
                                {error && <Message negative>
                                    <Message.Header>Could not archive environment</Message.Header>
                                    <p>{error && error.message}</p>
                                </Message>
                                }
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color={'grey'} basic onClick={() => setShowDeleteEnv(false)}>
                                Cancel
                            </Button>
                            <Button
                                color={'red'}
                                basic
                                content="Archive"
                                labelPosition='left'
                                icon='archive'
                                onClick={archiveEnv}
                            />
                        </Modal.Actions>
                    </Modal>
                </ReactIf.Then>
            </ReactIf.If>
        </div>

    );
    const actions = <Actions {...env}/>
    const Status = () => (
        <Label tag style={{fontSize:'xx-small'}}>{env.stack.status.toUpperCase()}</Label>
    )
    return <ObjectView
        loading={loading}
        title={env.label}
        icon={<BsIcon.BsCloud/>}
        breadcrumbs={`on-board/organization/environment/${env.environmentUri}`}
        label={env.label}
        back={{
            link: '/environments',
            label: '< back to environments'
        }}
        owner={env.owner}
        created={env.created}
        tabs={["overview","console", "datasets", "shared","warehouses", "stack"]}
        actions={actions}
        status={<Status {...env}/>}
    >
        <Components.Editor
            editable={["Admin", "Owner"].indexOf(env.userRoleInEnvironment) == -1 ? false : true}
            environment={env}
        />
        <Components.ConsoleAccess
            environment={env}
            editable={["Admin", "Owner"].indexOf(env.userRoleInEnvironment) == -1 ? false : true}
        />
        <Components.DatasetList environment={env}/>
        <Components.SharedList environment={env}/>
        <Components.Warehouses environment={env}/>
        <Stack stack={env.stack} reload={fetchItem}/>
    </ObjectView>
}


export default EnvironmentView;
