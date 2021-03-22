import {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {TableContainer} from "../../../components/table";
import useClient from "../../../api/client";
import * as BsIcons from "react-icons/bs";
import {Header, Container, Button, Icon} from "semantic-ui-react";
import listOrganizationEnvrionments from "../../../api/Environment/listOrganizationEnvironments"
import {PagedResponseDefault} from "../../../components/defaults";

const EnvironmentList = ({organization, environments, setEnvironments}) => {
    const history = useHistory();
    const client = useClient();
    const [items, setItems] = useState(environments ? environments : PagedResponseDefault);
    const [loading, setLoading] = useState(true);
    const [filter,setFilter]= useState({term:'',page:1, pageSize:10});

    const handlePageChange=(e,{activePage})=>{
        if (activePage<items.pages){
            setFilter({...filter, page:activePage})
        }
    }
    const fetchItems = async () => {
        const response = await client.query(listOrganizationEnvrionments({filter:filter,organizationUri: organization.organizationUri}));
        if (!response.errors) {
            setItems({...response.data.getOrganization.environments});
            setEnvironments && setEnvironments({...response.data.getOrganization.environments});
        }
        setLoading(false);
    }

    useEffect(() => {
        if (client) {
            if (!environments) {
                fetchItems();
            }
        }
    }, [client,filter.page]);

    return <div>
        <TableContainer
        loading={loading}
        pager={{
            ...items,
            loading: loading,
            onSearch: fetchItems,
            onPageChange:handlePageChange,
            term: filter.term,
            onTermChange:(e)=>{setFilter({...filter,term:e.target.value})}
        }}
        columns={[
            {label: "Name", key: "label"},
            {label: "AWS Account", key: 'AwsAccountId'},
            {label: 'Region', key: "region"},
            {label: "Admins", key: "SamlGroupName"},
            {label: "Created", key: "created"},
            {label: "Created By", key: "owner"},
        ]}
        rows={items.nodes.map((node) => {
            return {
                ...node,
                AwsAccountId: <code>{node.AwsAccountId}</code>,
                label: (<Header as='h4' image>
                    <BsIcons.BsCloud/>
                    <Header.Content>
                        <Link to={`/environment/${node.environmentUri}/overview`}>{node.label}</Link>
                        <Header.Subheader>
                            <Link to={`/environment/${node.environmentUri}/overview`}>{node.environmentUri}</Link>
                        </Header.Subheader>
                    </Header.Content>
                </Header>)
            }
        })}
    /></div>
}

export default EnvironmentList;
