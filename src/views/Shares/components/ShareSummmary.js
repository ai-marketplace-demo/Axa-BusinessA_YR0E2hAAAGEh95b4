import {Table} from "semantic-ui-react";


const ShareSummary = ({share,client})=>{
    return <Table compact>
        <Table.Header>
            <Table.Row>
                <Table.Cell>
                    Dataset
                </Table.Cell>
                <Table.Cell>
                    {share.dataset.datasetName}
                </Table.Cell>


            </Table.Row>
            <Table.Row>
                <Table.Cell>
                    Team
                </Table.Cell>
                <Table.Cell>
                    {share.principal.principalName}
                </Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>
                    Aws Account Id
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
