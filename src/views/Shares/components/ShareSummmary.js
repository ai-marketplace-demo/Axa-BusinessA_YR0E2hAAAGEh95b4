import {Link} from "react-router-dom";
import {Table} from "semantic-ui-react";


const ShareSummary = ({share,client})=>{
    return <Table compact>
        <Table.Header>
            <Table.Row>
                <Table.Cell>
                    Dataset
                </Table.Cell>
                <Table.Cell>
                    <Link style={{color:'blue'}} to={`/dataset/${share.dataset.datasetUri}/overview`}>
                        {share.dataset.datasetName}
                    </Link>
                </Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>
                    Business Owner
                </Table.Cell>
                <Table.Cell>
                    {share.dataset.businessOwnerEmail}
                </Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>
                    Share Role
                </Table.Cell>
                <Table.Cell>
                    {share.userRoleForShareObject}
                </Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>
                    Status
                </Table.Cell>
                <Table.Cell>
                    {share.status}
                </Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>
                    Requesters Team
                </Table.Cell>
                <Table.Cell>
                    {share.principal.principalName}
                </Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>
                    AWS Account
                </Table.Cell>
                <Table.Cell>
                    {share.principal.AwsAccountId}
                </Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>
                    Region
                </Table.Cell>
                <Table.Cell>
                    {share.principal.region}
                </Table.Cell>
            </Table.Row>
        </Table.Header>
    </Table>

}


export default ShareSummary;
