import {useState} from "react";
import useClient from "../../../api/client";
import {Button, Icon, Table} from "semantic-ui-react";
import {If, Then} from "react-if";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import generateEnvironmentAccessToken from "../../../api/Environment/generateEnvironmentAccessToken";
import getEnvironmentAssumeRoleUrl from "../../../api/Environment/getEnvironmentAssumeRoleUrl";


const ConsoleAccess = ({environment, editable}) => {
    const client = useClient();
    const [state, setState] = useState({
        url: {
            loading: false,
            available: false,
            url: null
        },
        json: {
            loading: false,
            available: false,
            data: null,
            copied: false
        },
        bash: {
            loading: false,
            available: false,
            data: ""
        }
    });

    const trigger = async (e) => {
        if (e.target.name == "bash") {
            setState({...state, bash: {...state.bash, loading: true}});
            setTimeout(() => {
                setState({...state, bash: {loading: false, available: true, data: "export xxxx"}});
            }, 700)

        } else if (e.target.name == "json") {
            setState({...state, json: {...state.json, loading: true}});
            const response = await client.query(generateEnvironmentAccessToken({environmentUri: environment.environmentUri}));
            if (!response.errors) {
                setState({
                    ...state,
                    json: {loading: false, available: true, data: response.data.generateEnvironmentAccessToken}
                });
            }


        } else if (e.target.name == "url") {
            setState({...state, url: {...state.url, loading: true}});
            const response = await client.query(getEnvironmentAssumeRoleUrl({environmentUri: environment.environmentUri}));
            if (!response.errors) {
                setState({
                    ...state,
                    url: {loading: false, available: true, data: response.data.getEnvironmentAssumeRoleUrl}
                });
            }

        }
    }


    return <Table celled compact>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell width={1}>Type</Table.HeaderCell>
                <Table.HeaderCell width={2}>Generate</Table.HeaderCell>
                <Table.HeaderCell width={6}>{`>_`}</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Row>
            <Table.Cell>
                <code>URL</code>
            </Table.Cell>
            <Table.Cell>

                <Button size='small' name={`url`} onClick={trigger} disabled={!editable} loading={state.url.loading}
                        icon labelPosition='left'>
                    <Icon name='linkify'/>
                    Link
                </Button>
            </Table.Cell>
            <Table.Cell>
                <If condition={state.url.data}>
                    <Then>
                        <a target={`_blank`} href={`${state.url.data}`}>
                            Console Access
                        </a>
                    </Then>
                </If>

            </Table.Cell>
        </Table.Row>

        <Table.Row>
            <Table.Cell>
                <code>JSON</code>
            </Table.Cell>
            <Table.Cell>
                <Button size='small' name={`json`} onClick={trigger} disabled={!editable} loading={state.json.loading}
                        icon labelPosition='left'>
                    <Icon name='file'/>
                    Json
                </Button>
            </Table.Cell>
            <Table.Cell>
                <If condition={state.json.data}>
                    <Then>
                        <CopyToClipboard
                            onCopy={() => {
                                setState({...state, json: {...state.json, copied: true}})
                            }}
                            text={state.json.data}>
                            <Icon size={`large`} name={"clipboard outline"}/>
                        </CopyToClipboard>
                        {state.json.copied ? <i>copied</i> : ""}
                    </Then>
                </If>
            </Table.Cell>
        </Table.Row>

    </Table>
}

export default ConsoleAccess;
