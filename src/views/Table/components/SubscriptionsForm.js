import React, {useState, useEffect}  from "react";
import useClient from "../../../api/client";
import publishDatasetTableUpdate from "../../../api/DatasetTable/publishDatasetTableUpdate";
import {Button, Form, Message} from "semantic-ui-react";

const SubscriptionsForm = ({table}) => {
    const client = useClient();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showInfo, setShowInfo] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const submitForm = async () => {
        setSuccess(null);
        setError(null);
        setPublishing(true);
        const response = await client
            .mutate(publishDatasetTableUpdate({
                tableUri: table.tableUri,
            }))

        if (!response.errors) {
            setSuccess({
                header: `Table Update`,
                content: `Notification published successfully to all table ${table.GlueTableName} subscribers`
            })
        } else {
            setError({
                header: `Table Update`,
                content: `${response.errors[0].message}`
            })
        }
        setPublishing(false);
    };
    const isAdmin = () => {
        return ["Creator", "Admin", "Owner"].indexOf(table?.dataset?.userRoleForDataset) == -1 ? false : true
    }

    return <div>
        {success && <Message positive onDismiss={()=>(setSuccess(null))}>
            <Message.Header>{success.header}</Message.Header>
            <p>{success && success.content}</p>
        </Message>
        }
        {error && <Message negative onDismiss={()=>(setError(null))}>
            <Message.Header>{error.header}</Message.Header>
            <p>{error && error.content}</p>
        </Message>
        }
        {showInfo &&
            <Message
                positive
                info
                onDismiss={()=>(setShowInfo(false))}
                icon={'bullhorn'}
                header={'Table Update Notification'}
                content={
                    <p>
                        Let your table subscribers know that new data is available.
                        Your update will be published to SNS topic
                        <b> {table.dataset.environment.subscriptionsProducersTopicName}.</b>
                    </p>
                }
            />
        }
        <Form>
            <Form.Field>
                <label>Dataset</label>
                <Form.Input
                    icon={'folder'}
                    iconPosition={'left'}
                    value={table.dataset.name}
                    readOnly={true}
                />
            </Form.Field>
            <Form.Field>
                <label>Database</label>
                <Form.Input
                    icon={'database'}
                    iconPosition={'left'}
                    value={table.GlueDatabaseName}
                    readOnly={true}
                />
            </Form.Field>
            <Form.Field>
                <label>Table</label>
                <Form.Input
                    readOnly={true}
                    icon={'table'}
                    iconPosition={'left'}
                    value={table.GlueTableName}
                />
            </Form.Field>
            <Form.Field>
                <label>Location</label>
                <Form.Input
                    icon={'bitbucket'}
                    iconPosition={'left'}
                    readOnly={true}
                    value={table.S3Prefix}/>
            </Form.Field>
            {isAdmin() &&<Button
                type={'submit'}
                size={'small'}
                color={'blue'}
                loading={publishing}
                onClick={submitForm}
            >Publish</Button>}
        </Form>
    </div>
};
export default SubscriptionsForm;
