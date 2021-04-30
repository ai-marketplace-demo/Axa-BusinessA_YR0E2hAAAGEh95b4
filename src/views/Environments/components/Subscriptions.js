import React, {useEffect, useState} from "react";
import {useHistory, Link} from "react-router-dom";
import useClient from "../../../api/client";
import {Button, Segment, Input, Header, Icon, Loader, Message, Modal, Table, Form, Checkbox} from "semantic-ui-react";
import enableDataSubscriptions from '../../../api/Environment/enableDataSubscriptions';
import disableDataSubscriptions from '../../../api/Environment/disableDataSubscriptions';
import * as ReactIf from "react-if";
import {CopyToClipboard} from "react-copy-to-clipboard";

const Subscriptions = ({environment, fetchItem}) => {
    const client = useClient();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [enabling, setEnabling] = useState(false);
    const [disabling, setDisabling] = useState(false);
    const [showSubscriptionsForm, setShowSubscriptionsForm] = useState(false);
    const [showTopicArnInput, setShowTopicArnInput] = useState(false);
    const [formData, setFormData] = useState({
        producersTopicArn:'',
    });
    const handleChange = (e) => {
        setFormData({
            producersTopicArn: e.target.value
        });
    }
    const handleCheckbox = (e) => {
        setShowTopicArnInput(!showTopicArnInput)
        if (!e.target.value)
            setFormData({
                producersTopicArn: ''
            });
    }

    const submitForm=async ()=>{
        setEnabling(true)
        const response = await client.mutate(enableDataSubscriptions({
            environmentUri : environment.environmentUri,
            input:formData
        }));
        if (!response.errors) {
            fetchItem();
            setFormData({
                producersTopicArn: ''
            });
            setShowSubscriptionsForm(false)
            setSuccess({
                header: `Enable Data Subscriptions`,
                content: `Successfully enabled data subscriptions for this environment`
            })
        } else {
            setError({
                header: `Enable Data Subscriptions`,
                content: `Failed to enable subscriptions due to: ${response.errors[0].message}`
            })
        }
        setEnabling(false)
    };
    const disableSubscriptions=async ()=>{
        setDisabling(true);
        const response = await client.mutate(disableDataSubscriptions({
            environmentUri : environment.environmentUri,
        }));
        if (!response.errors) {
            fetchItem();
            setSuccess({
                header: `Disable Data Subscriptions`,
                content: `Successfully disabled data subscriptions for this environment`
            })
            setShowSubscriptionsForm(false)
        } else {
            setError({
                header: `Disable Data Subscriptions`,
                content: `Failed to disable subscriptions due to: ${response.errors[0].message}`
            })
        }
        setDisabling(false);
    };
    return <div>
        {success && <Message positive onDismiss={()=>(setSuccess(null))}>
            <Message.Header>{success.header}</Message.Header>
            <p>{success && success.content}</p>
        </Message>}
        {error &&
            <Message negative>
                <Message.Header>
                    {error && error.header}
                </Message.Header>
                <p>
                    {error && error.content}
                </p>
                <Message.Content>
                    <Button onClick={() => {
                        setError(null)
                    }}>Close</Button>
                </Message.Content>
            </Message>
        }
        <div style={{marginBottom: "10px"}}>
            {!environment.subscriptionsEnabled &&
                <Button loading={loading} onClick={() => setShowSubscriptionsForm(true)}
                        content='Enable Subscriptions'
                        icon='bullhorn' labelPosition='left' size={'small'}/>
            }
            {environment.subscriptionsEnabled &&
                <Button loading={disabling} onClick={disableSubscriptions}
                        content='Disable Subscriptions'
                        icon='alarm mute' labelPosition='left' size={'small'}/>
            }
        </div>
        <div>
            <ReactIf.If condition={showSubscriptionsForm}>
                <ReactIf.Then>
                    <Modal
                        centered={false}
                        onClose={() => setShowSubscriptionsForm(false)}
                        onOpen={() => setShowSubscriptionsForm(true)}
                        open={() => setShowSubscriptionsForm(true)}
                        size='large'
                        trigger={<span/>}
                    >
                        <Modal.Header>
                            <b>Enable data subscriptions for environment: {environment.label} </b>
                        </Modal.Header>
                        <Modal.Content>
                            {error && <Message negative>
                                <Message.Header>{error.header}</Message.Header>
                                <p>{error && error.content}</p>
                            </Message>
                            }
                            <Message>
                                <Message.Content><p>Datahub will create an SNS Topic that you can use for publishing datasets updates.
                                    You can also bring your own SNS topic.</p>
                                </Message.Content>
                            </Message>
                            <Form>
                                <Form.Field>
                                    <Checkbox value={showTopicArnInput} onClick={handleCheckbox} label={'Bring your own SNS topic'}></Checkbox>
                                </Form.Field>
                                { showTopicArnInput &&
                                    <Form.Field>
                                        <label>SNS Topic</label>
                                        <Input
                                            label={`arn:aws:sns:${environment.region}:${environment.AwsAccountId}:`}
                                            placeholder={`YOUR_TOPIC_NAME`}
                                            name={'producersTopicArn'}
                                            value={formData.producersTopicArn}
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </Form.Field>
                                }
                                <Button
                                    type={'submit'}
                                    color={'blue'}
                                    onClick={submitForm}
                                >Create</Button>
                                <Button
                                    type={'button'}
                                    color={'grey'}
                                    onClick={() => setShowSubscriptionsForm(false)}
                                >Cancel</Button>
                            </Form>
                        </Modal.Content>
                    </Modal>
                </ReactIf.Then>
            </ReactIf.If>
        </div>
        {environment.subscriptionsEnabled &&
            <div>
                <Segment.Group>
                    <Segment><b>Data Producers Topic</b></Segment>
                    <Segment.Group horizontal>
                        <Segment>
                            <Message
                                header='Notify data consumers ?'
                                content={'Subscribe your data processes to SNS topic and publish the latest datasets updates to data consumers.'}

                            />
                        <Form>
                            <Form.Field>
                                <label>SNS Topic Arn</label>
                                <Form.Input
                                    readOnly={true}
                                    action={{
                                        content: <CopyToClipboard
                                            onCopy={() => {
                                            }}
                                            text={`arn:aws:sns:${environment.region}:${environment.AwsAccountId}:${environment.subscriptionsProducersTopicName}`}>
                                            <Icon size={`small`} name={"copy"} fitted/>
                                        </CopyToClipboard>,
                                    }}
                                    actionPosition='left'
                                    defaultValue={`arn:aws:sns:${environment.region}:${environment.AwsAccountId}:${environment.subscriptionsProducersTopicName}`}
                                />
                            </Form.Field>
                        </Form>
                        </Segment>

                    </Segment.Group>
                </Segment.Group>
                <Segment.Group>
                    <Segment><b>Data Consumers Topic</b></Segment>
                    <Segment.Group horizontal>
                        <Segment>
                            <Message
                                header='Updates from datasets owners ?'
                                content={'Subscribe your data processes to SNS topic and receive the latest datasets updates from data owners.'}

                            />
                            <Form>
                                <Form.Field>
                                    <label>SNS Topic Arn</label>
                                    <Form.Input
                                        readOnly={true}
                                        action={{
                                            content: <CopyToClipboard
                                                onCopy={() => {
                                                }}
                                                text={`arn:aws:sns:${environment.region}:${environment.AwsAccountId}:${environment.subscriptionsConsumersTopicName}`}>
                                                <Icon size={`small`} name={"copy"} fitted/>
                                            </CopyToClipboard>,
                                        }}
                                        actionPosition='left'
                                        defaultValue={`arn:aws:sns:${environment.region}:${environment.AwsAccountId}:${environment.subscriptionsConsumersTopicName}`}
                                    />
                                </Form.Field>
                            </Form>
                        </Segment>

                    </Segment.Group>
                </Segment.Group>
            </div>

        }
    </div>

}

export default Subscriptions;
