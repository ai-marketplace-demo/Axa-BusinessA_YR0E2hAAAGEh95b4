import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { Switch, Case, Default } from 'react-if';
import { toast } from 'react-toastify';
import useClient from '../../../api/client';
import getProjectNotebookAuthorizedUrl from '../../../api/Project/getProjectNotebookAuthorizedUrl';
import stopNotebook from '../../../api/Project/stopNotebook';
import startNotebook from '../../../api/Project/startNotebook';

const NotebookItem = (props) => {
    const client = useClient();
    const { notebook } = props;
    const [notebookState, setNotebookState] = useState(notebook.NotebookInstanceStatus);
    const [linkState, setLinkState] = useState({
        fetching: false, url: ''
    });


    const stopProjectNotebook = async () => {
        setNotebookState('Stopping');
        const response = await client.mutate(stopNotebook(notebook.notebookUri));
    };


    const startProjectNotebook = async () => {
        setNotebookState('Starting');
        const response = await client.mutate(startNotebook(notebook.notebookUri));
    };
    const fetchUrl = async () => {
        setLinkState({ fetching: true, url: '' });
        const response = await client.query(
            getProjectNotebookAuthorizedUrl(notebook.notebookUri)
        );
        if (!response.errors) {
            toast(`Retrieved url ${response.data.getProjectNotebookAuthorizedUrl}`);
            setLinkState({ url: response.data.getProjectNotebookAuthorizedUrl, fetching: false });
        } else {
            setLinkState({ url: 'Failed to retrieve url', fetching: false });
            toast(`Could not retrieve url, received ${response.errors[0].message}`);
        }
    };


    return (
        <tr>
            <td>{notebook.NotebookInstanceName}</td>
            <td>{notebook.NotebookInstanceStatus}</td>
            <td>
                <Switch>
                    <Case condition={notebookState == 'InService'}>
                        <Switch>
                            <Case condition={linkState.fetching}>
                                <Spinner size={'sm'} animation={'grow'} variant={'primary'} />
                            </Case>
                            <Case condition={linkState.url}>
                                <a target={'_blank'} href={linkState.url}>Jump to jupyter</a>
                            </Case>
                            <Default>
                                <div onClick={fetchUrl} className={'btn btn-sm btn-primary '}>Connect</div>
                            </Default>
                        </Switch>
                    </Case>
                </Switch>
            </td>

            <td>
                <Switch>
                    <Case condition={notebookState == 'InService'}>
                        <div onClick={stopProjectNotebook} className={'btn btn-sm btn-warning'}>Stop</div>
                    </Case>
                    <Case condition={notebookState == 'Stopped'}>
                        <div onClick={startProjectNotebook} className={'btn btn-sm btn-success'}>Start</div>
                    </Case>
                </Switch>
            </td>
        </tr>
    );
};


export default NotebookItem;
