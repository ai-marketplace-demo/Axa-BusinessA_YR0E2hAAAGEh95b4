import {useState} from "react";
import DataView from "../../components/listview/DataView";
import * as BsIcon from "react-icons/bs";
import CollectionListItem from "./CollectionListItem";


const CollectionLink = ({item}) => {
    return `/collection/${item.uri}/`
}
const CollectionList = (props) => {
    const [items, setItems] = useState({
            count: 1,
            page: 1,
            pages: 1,
            hasNext: false,
            hasPrevious: false,
            nodes: [
                {
                    uri: "1",
                    created: Date.parse('01 Jan 2021 00:12:00 GMT'),
                    owner: 'moshirm@amazon.fr',
                    tags: ["finance"],
                    label: 'Finances',
                    description: 'Finance collection',
                    stats: {
                        dashboards: 1,
                        datasets: 3,
                        tables: 4
                    }
                }
            ]
        }
    )
    return <DataView
        items={items}
        itemBody={CollectionListItem}
        icon={<BsIcon.BsHeart/>}
        breadcrumbs={`/collections`}
        title={`Collections`}
        keyField={`uri`}
        collectionable={false}
        creatable={true}
        commentable={true}
        createLink={() => {
            return `/new-collection`
        }}
        linkComponent={CollectionLink}
        loading={false}/>
}


export default CollectionList;
