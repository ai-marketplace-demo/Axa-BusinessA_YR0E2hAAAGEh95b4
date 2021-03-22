import {useEffect, useState} from "react";
import DataView from "../../components/listview/DataView";
import * as BsIcon from "react-icons/bs";


const TableLink = ({item}) => {
    return `/table/${item.tableUri}/`
}
const TableList = (props) => {
    const [items, setItems] = useState({count: 0, page: 1, pages: 1, hasNext: false, hasPrevious: false, nodes: []})
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setItems({
                count: 5,
                page: 1, pages: 1,
                hasNext: false,
                hasPrevious: false,
                nodes: [

                    {
                        tableUri: 'z',
                        name: 'dataset1',
                        label: 'dataset122',
                        description: 'my dataset is really nice',
                        created: new Date(),
                        owner: `moshirm@amazon.fr`
                    },
                    {
                        tableUri: 't',
                        name: 'table2',
                        label: 'table2',
                        description: 'my dataset is not so nice',
                        created: new Date(),
                        tags: ["a", "b"],
                        owner: `moshirm@amazon.fr`
                    }
                ]
            })
            setLoading(false);
        }, 1000)
    })
    return <DataView
        icon={<BsIcon.BsTable/>}
        title={"Tables"}
        linkComponent={TableLink}
        breadcrumbs={"/catalog/review"}
        loading={loading}
        items={items}
        commentable={true}
        collectionable={true}
        creatable={false}
        keyField={`datasetUri`}
        itemBody={() => {
        }}
    />
}


export default TableList;
