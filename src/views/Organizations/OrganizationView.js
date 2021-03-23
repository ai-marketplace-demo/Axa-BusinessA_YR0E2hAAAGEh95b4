import React, { useState, useEffect } from 'react';
import * as BsIcon from "react-icons/bs";
import ObjectView from "../../components/view/ObjectViewTemplate";
import * as Components from "./components";
import {useParams, useHistory, Link} from "react-router-dom";
import useClient from "../../api/client";
import {Button, Modal, Header, Message, Dropdown, Icon} from "semantic-ui-react";
import getOrganization from "../../api/Organization/getOrganization";
import archiveOrganization from "../../api/Organization/archiveOrganization";
import * as ReactIf from "react-if";

const OrganizationView = (props) => {
    const history = useHistory();
    const params = useParams();
    const client = useClient();
    const [loading, setLoading] = useState(true);
    const [showDeleteOrg, setShowDeleteOrg] = useState(false);

    let [error, setError] = useState(null);
    const [org, setOrg] = useState({})
    const fetchItem = async () => {
        const response = await client.query(getOrganization(params.uri));
        if (!response.errors) {
            setOrg(response.data.getOrganization);
            setLoading(false);
        } else {
            setError({
                header: 'Error',
                content: `Could not retrieve organization ${params.uri}`
            })
        }
        setLoading(false);
    }

    useEffect(() => {
        if (client) {
            fetchItem();
        }
    }, [client]);

    const archiveOrg = async () => {
        const response = await client.mutate(archiveOrganization(org.organizationUri));
        if (!response.errors) {
            history.push('/organizations')
            setLoading(false);
        } else {
            setError({
                header: 'Error',
                content: `Could not delete organization: ${response.errors[0].message}`
            })
        }
    };

    const linkEnvironment=()=>{
        history.push(`/new-environment/${org.organizationUri}`);
    }
    const isAdmin = (org) => {
        return ["Owner", "Admin"].indexOf(org.userRoleInOrganization) == -1 ? false : true
    }

    const Actions = (org) => (
        <ReactIf.If condition={isAdmin(org)}>
            <ReactIf.Then>
                <div>
                    <Button.Group color='blue'>
                        <Button size='small' onClick={linkEnvironment}><Icon name={'linkify'}/>Link Environment
                        </Button>
                        <Dropdown.Divider />
                        <Dropdown
                            className='button icon'
                            options={[
                                { key: 'delete', text: <Button basic onClick={() => setShowDeleteOrg(true)}>
                                        <Icon name='trash'/> Delete
                                    </Button>, value: 'delete' },
                            ]}
                            trigger={<></>}
                        />
                    </Button.Group>
                    <ReactIf.If condition={showDeleteOrg}>
                        <ReactIf.Then>
                            <Modal
                                centered={false}
                                onClose={() => setShowDeleteOrg(false)}
                                onOpen={() => setShowDeleteOrg(true)}
                                open={() => {setShowDeleteOrg(true)}}
                                size='small'
                                trigger={<span/>}
                            >
                                <Modal.Content>
                                    <Modal.Description>
                                        <Header>Delete organization {org.label} ?</Header>
                                        <p>
                                            You must first delete all environments linked to this organization !
                                        </p>
                                        {error && <Message negative>
                                            <Message.Header>Could not delete organization</Message.Header>
                                            <p>{error && error.message}</p>
                                        </Message>
                                        }
                                    </Modal.Description>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button color={'grey'} onClick={() => setShowDeleteOrg(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        color={'red'}
                                        content="Confirm"
                                        labelPosition='left'
                                        icon='trash'
                                        onClick={archiveOrg}
                                    />
                                </Modal.Actions>
                            </Modal>
                        </ReactIf.Then>
                    </ReactIf.If>
                </div>
            </ReactIf.Then>
        </ReactIf.If>

    );
    const actions = <Actions {...org}/>

    return(<div>
        <ObjectView
            loading={loading}
            title={org.label}
            icon={<BsIcon.BsHouse/>}
            breadcrumbs={`on-board/org/${org.label}/${org.organizationUri}`}
            label={org.label}
            back={{
                link: '/organizations',
                label: '< back to organizations'
            }}

            owner={org.owner}
            created={org.created}
            tabs={["overview", "environments"]}
            actions={actions}
        >
            <Components.OrganizationEditor
                editable={["Owner", "Admin"].indexOf(org.userRoleInOrganization) == -1 ? false : true}
                organization={org}/>
            <Components.EnvironmentList organization={org}/>
        </ObjectView>
    </div>)
}


export default OrganizationView;
