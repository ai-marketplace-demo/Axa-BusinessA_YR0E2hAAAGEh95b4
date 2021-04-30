import React, {useEffect, useState} from "react";
import getRedshiftClusterDatabaseCredentials from "../../../api/RedshiftCluster/getClusterDatabaseCredentials";
import useClient from "../../../api/client";
import {Divider, Message, Segment, Header, Button, Form} from "semantic-ui-react";


const Connection = ({warehouse}) => {
    const client = useClient();
    const jdbc = `jdbc:redshift://${warehouse.endpoint || '-'}:${warehouse.port}/${warehouse.databaseName}`;
    const odbc = `Driver={Amazon Redshift (x64)}; Server=${warehouse.endpoint || '-'}; Database=${warehouse.databaseName}`;
    let [clusterCreds, setClusterCreds] = useState({password: '-'});
    const [message, setMessage] = useState(null);
    const getCreds= async()=> {
        const response = await client.query(
            getRedshiftClusterDatabaseCredentials(warehouse.clusterUri)
        );
        if (!response.errors) {
            setClusterCreds({...response.data.getRedshiftClusterDatabaseCredentials});
            console.log("cluster credentials = ", clusterCreds);
        } else {
            setMessage({
                negative: true,
                header: `Update Notification`,
                content: `${response.errors[0].message}`
            })
        }
    };

    useEffect(() => {
        if (client && warehouse) {
            getCreds();
        }
    }, [client]);


    return <div>
        {message && <Message positive={message.positive} negative={message.negative} onDismiss={() => setMessage(null)}>
            <Message.Header>{message.header}</Message.Header>
            <Message.Content>
                <p>{message.content}</p>
            </Message.Content>
        </Message>
        }
        <div>
            <Segment style={{borderRadius: "0px"}}>
                <Header size='medium'>Connection</Header>
                <Form attached>
                    <Form.Field>
                        <label>Endpoint</label>
                        <Form.Input
                            icon={'linkify'}
                            iconPosition={'left'}
                            value={warehouse.endpoint}
                            readOnly={true}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Port</label>
                        <Form.Input
                            icon={'info'}
                            iconPosition={'left'}
                            value={warehouse.port}
                            readOnly={true}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>JDBC URL</label>
                        <Form.Input
                            readOnly={true}
                            icon={'info'}
                            iconPosition={'left'}
                            value={jdbc}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>ODBC URL</label>
                        <Form.Input
                            icon={'info'}
                            iconPosition={'left'}
                            readOnly={true}
                            value={odbc}/>
                    </Form.Field>
                </Form>
            </Segment>
        </div>
        <Divider hidden/>
        <div>
            <Segment style={{borderRadius: "0px"}}>
                <Header size='medium'>Credentials</Header>
                <Form>
                    <Form.Field>
                        <label>Database</label>
                        <Form.Input
                            icon={'database'}
                            iconPosition={'left'}
                            value={warehouse.databaseName}
                            readOnly={true}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Database user</label>
                        <Form.Input
                            readOnly={true}
                            icon={'user'}
                            iconPosition={'left'}
                            value={warehouse.databaseUser}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Database password</label>
                        <Form.Input
                            icon={'key'}
                            iconPosition={'left'}
                            readOnly={true}
                            value={clusterCreds.password}/>
                    </Form.Field>
                </Form>
            </Segment>
        </div>

        </div>
}

export default Connection;
