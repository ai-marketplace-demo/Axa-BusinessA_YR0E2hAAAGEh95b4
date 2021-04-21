import React, {useEffect, useState} from "react";
import * as BsIcon from "react-icons/bs";
import * as SiIcon from 'react-icons/si';
import {Link, useHistory, useParams} from "react-router-dom";
import ObjectView from "../../components/view/ObjectViewTemplate";
import * as Components from "./components";
import useClient from "../../api/client";
import getSagemakerStudioUserProfile from "../../api/SagemakerStudio/getSagemakerStudioUserProfile";
import Stack from "../Stack/Stack";
import {Button, Dimmer, Dropdown, Header, Icon, Label, Loader, Message, Modal, Table} from "semantic-ui-react";
import * as ReactIf from "react-if";
import getSagemakerStudioUserProfilePresignedUrl
    from "../../api/SagemakerStudio/getSagemakerStudioUserProfilePresignedUrl";
import deleteSagemakerStudioUserProfile from "../../api/SagemakerStudio/deleteSagemakerStudioUserProfile";


const SagemakerStudioView = (props) => {
    const params = useParams();
    const client = useClient();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    let [error, setError] = useState(null);
    const [SagemakerStudioUserProfile, setSagemakerStudioUserProfile] = useState({})
    const [showDelete, setShowDelete] = useState(false)
    const [userProfileApps, setUserProfileApps] = useState([])
    const [isOpeningSagemakerStudio, setIsOpeningSagemakerStudio] = useState(false);
    const [errors, setErrors] = useState(null);
    const [success, setSuccess] = useState(null);

    const getThisSagemakerStudioUserProfilePresignedUrl = async () => {
        setIsOpeningSagemakerStudio(true);
        const response = await client.query(getSagemakerStudioUserProfilePresignedUrl(SagemakerStudioUserProfile.sagemakerStudioUserProfileUri))
        if (!response.errors) {
            window.open(response.data.getSagemakerStudioUserProfilePresignedUrl)
        } else {
            setErrors(response.errors)
        }
        setIsOpeningSagemakerStudio(false);

    }
    const removeSagemakerStudioUserProfile = async () => {
        const response = await client.mutate(deleteSagemakerStudioUserProfile(SagemakerStudioUserProfile.sagemakerStudioUserProfileUri));
        if (!response.errors) {
            history.push(`/sagemakerstudio/userprofiles`)
        } else {
            setError({
                header: 'Error',
                content: `Could not archive dataset ${params.uri}`
            })
        }
    };

    const backLink = <Link to={`/sagemakerstudio/userprofiles`}>
        <small>{`<`} back to user profiles</small>
    </Link>


    const fetchItem = async () => {
        const response = await client.query(getSagemakerStudioUserProfile(params.uri));
        if (!response.errors) {
            setSagemakerStudioUserProfile(response.data.getSagemakerStudioUserProfile);
            setUserProfileApps(response.data.getSagemakerStudioUserProfile.sagemakerStudioUserProfileApps)
            setLoading(false);
        } else {
            setError({
                header: 'Error',
                content: `Could not retrieve Sagemaker user profile ${response.errors[0].messages}`
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
            if (["Creator", "Admin", "Owner"].indexOf(d.userRoleForSagemakerStudioUserProfile) != -1) {
                return true
            } else {
                return false
            }
        }
    }

    const Actions = () => (
        <ReactIf.If condition={isAdmin(SagemakerStudioUserProfile)}>
            <ReactIf.Then>
                <div>
                    <Button.Group>
                        <Button.Group color='blue'>
                            <Button loading={isOpeningSagemakerStudio}
                                    onClick={getThisSagemakerStudioUserProfilePresignedUrl}><SiIcon.SiJupyter/> Go to
                                Sagemaker Studio

                            </Button>
                            <Dropdown.Divider/>
                            <Dropdown
                                className='button icon'
                                options={[
                                    {
                                        key: 'delete', text: <Button basic onClick={() => setShowDelete(true)}>
                                            <Icon name='trash'/>
                                            Delete
                                        </Button>, value: 'delete'
                                    },
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
                                        <Header>Delete SageMaker
                                            Instance {SagemakerStudioUserProfile.label} ?</Header>

                                        {error && <Message negaFtive>
                                            <Message.Header>error.header</Message.Header>
                                            <p>{error && error.content}</p>
                                        </Message>
                                        }
                                    </Modal.Description>

                                    <ReactIf.If condition={userProfileApps.length > 0}>
                                        <ReactIf.Then>
                                            <p>
                                                Make sure to delete the following applications running in the User
                                                Profile
                                                before
                                                deleting the user profile.
                                            </p>
                                            <Table celled compact>
                                                <Table.Header>
                                                    <Table.Row>
                                                        <Table.HeaderCell width={8}>DomainId</Table.HeaderCell>
                                                        <Table.HeaderCell
                                                            width={4}>UserProfileName</Table.HeaderCell>
                                                        <Table.HeaderCell width={4}>AppType</Table.HeaderCell>
                                                        <Table.HeaderCell width={4}>AppName</Table.HeaderCell>
                                                        <Table.HeaderCell width={4}>Status</Table.HeaderCell>
                                                    </Table.Row>
                                                </Table.Header>
                                                <Table.Body>
                                                    {
                                                        userProfileApps.map((app) => {
                                                            return <Table.Row>
                                                                <Table.Cell>
                                                                    {app.DomainId || '-'}
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    {app.UserProfileName || '-'}
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    {app.AppType || '-'}
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    {app.AppName || '-'}
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    {app.Status || '-'}
                                                                </Table.Cell>

                                                            </Table.Row>
                                                        })}
                                                </Table.Body>
                                            </Table>
                                        </ReactIf.Then>
                                    </ReactIf.If>
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
                                        disabled={userProfileApps.length > 0}
                                        onClick={removeSagemakerStudioUserProfile}
                                    />
                                </Modal.Actions>
                            </Modal>
                        </ReactIf.Then>
                    </ReactIf.If>
                </div>
            </ReactIf.Then>
        </ReactIf.If>

    );
    const actions = <Actions {...SagemakerStudioUserProfile}/>
    const Messages = () => (
        <div>{errors && <Message negative onDismiss={() => {
            setErrors(null)
        }}>
            <Message.Header>{errors.header}</Message.Header>
            <p>{errors.content}</p>
        </Message>
        }
            {success && <Message positive onDismiss={() => {
                setSuccess(null)
            }}>
                <Message.Header>{success.header}</Message.Header>
                <p>{success.content}</p>
            </Message>
            }
        </div>
    )
    const messages = <Messages {...errors}/>
    const Status = () => (
        <Label tag
               style={{fontSize: 'xx-small'}}>{SagemakerStudioUserProfile.sagemakerStudioUserProfileStatus.toUpperCase()}</Label>
    )
    const status = <Status {...SagemakerStudioUserProfile}/>
    return <ObjectView
        loading={loading}
        title={SagemakerStudioUserProfile.label}
        back={{
            link: '/sagemakerstudio/userprofiles',
            label: '< back to Sagemaker studio'
        }}
        icon={<BsIcon.BsCode/>}
        breadcrumbs={`play/sagemakerstudio/userprofile/${SagemakerStudioUserProfile.sagemakerStudioUserProfileUri}`}
        label={SagemakerStudioUserProfile.label}
        owner={SagemakerStudioUserProfile.owner}
        created={SagemakerStudioUserProfile.created}
        error={error}
        tabs={["Overview", "Instance", "Stack"]}
        actions={actions}
        messages={messages}
        status={status}
    >
        <Components.Editor SagemakerStudioUserProfile={{
            ...SagemakerStudioUserProfile
        }} editable={true}/>

        <Components.Settings SagemakerStudioUserProfile={SagemakerStudioUserProfile} editable={true}
                             reloadSagemakerStudioUserProfile={fetchItem}/>

        <Stack stack={SagemakerStudioUserProfile.stack} reload={fetchItem}/>
    </ObjectView>
}

export default SagemakerStudioView;
