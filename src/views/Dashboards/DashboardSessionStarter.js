import {useState, useEffect} from "react";
import {Button,Loader,Icon,Table} from "semantic-ui-react";
import {Link} from "react-router-dom";
import useClient from "../../api/client";
import PagedResponseDefault from "../../components/defaults/PagedResponseDefault";
import listEnvironments from "../../api/Environment/listEnvironments";
import getAuthorSession from "../../api/Dashboard/getDashboardAuthorSession";
const DashboardLink = ({item}) => {
    return `/dashboard/${item.dashboardUri}/`
}

const DashboardSessionStarter = (props) => {
    const [ready, setReady] = useState(false);
    const [items, setItems] = useState(PagedResponseDefault);
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState({});
    const client = useClient();


    const retrieveSessionLink = async (env)=>{
        setLoading(true);
        setLinks({...links, [env.environmentUri]: <Loader active/>});
        const response = await client.query(getAuthorSession(env.environmentUri));
        if (!response.errors){
            setLinks({...links, [env.environmentUri]: <a style={{"color":'blue'}} target={`_blank`} href={response.data.getAuthorSession}>Quicksight Session</a>});
        }
    }
    const fetchItems = async () => {
        const response = await client.query(listEnvironments({filter:{}}));
        if (!response.errors) {
            setItems(response.data.listEnvironments);
        }else {

        }
    }
    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client]);


    return <div>
        <Link style={{color:'blue'}} to={'/dashboards'}>{'<'}back to dashboards</Link>
        <div style={{color:'dodgerblue',fontSize:'x-large'}}> Start Quicksight Session </div>
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                       Name
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Aws Account
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Region
                    </Table.HeaderCell>
                    <Table.HeaderCell>

                    </Table.HeaderCell>
                    <Table.HeaderCell>

                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                    {
                        items.nodes.map((item)=>{
                            return <Table.Row>
                                <Table.Cell>
                                    {item.name}
                                </Table.Cell>
                                <Table.Cell>
                                    {item.AwsAccountId}
                                </Table.Cell>
                                <Table.Cell>
                                    {item.region}
                                </Table.Cell>
                                <Table.Cell>
                                    <Button
                                     onClick={()=>{retrieveSessionLink(item)}}
                                     size={`tiny`}
                                     color={`teal`}
                                     content='Start Session'
                                     icon='right arrow' labelPosition='right' />
                                </Table.Cell>
                                <Table.Cell>
                                    {
                                        links[item.environmentUri]&&links[item.environmentUri]||""
                                    }
                                </Table.Cell>
                            </Table.Row>

                        })
                    }
                </Table.Body>
        </Table>
    </div>
}


export default DashboardSessionStarter;

