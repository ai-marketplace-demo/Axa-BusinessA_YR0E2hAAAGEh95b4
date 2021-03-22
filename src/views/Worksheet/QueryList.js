import {useState} from "react";
import DataView from "../../components/listview/DataView";
import {useHistory} from "react-router-dom";
import * as AiIcons from "react-icons/ai";
import useClient from "../../api/client";
import {Button} from "semantic-ui-react";

const QueryLink = ({item}) => {
    return `/query/${item.queryUri}/`
}
const QueryList = (props) => {
    const history = useHistory();
    const [ready, setReady] = useState(false);
    const [items, setItems] = useState({count: 0, page: 1, pages: 1, hasNext: false, hasPrevious: false, nodes: []})
    const [loading, setLoading] = useState(true);
    const client = useClient();
    const redirect=()=>{
        history.push("/query-editor")
    }
    const action= <Button onClick={redirect} color={`teal`} content='Start Worksheet' icon='right arrow' labelPosition='right' />
    return <DataView
        icon={<AiIcons.AiOutlineExperiment/>}
        title={"Worksheets"}
        action={action}
        linkComponent={QueryLink}
        createLink={() => {
            return `/new-query`
        }}
        itemBody={() => {
        }}
        breadcrumbs={"play/worksheets"}
        loading={false}
        collectionable={false}
        commentable={false}
        creatable={true}
        items={{
            count: 1,
            page: 1,
            pages: 1,
            hasPrevious: false,
            hasNext: false,
            nodes: [
                {
                    queryUri: "x",
                    label: 'xxx',
                    owner: 'xxx',
                    created: new Date(),
                    tags: ["a", "b"],
                    stats: {}
                }
            ]
        }}
        keyField={`queryUri`}
    />
}


export default QueryList;
