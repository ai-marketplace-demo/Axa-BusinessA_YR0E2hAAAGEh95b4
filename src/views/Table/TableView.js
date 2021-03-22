import {useState,useEffect} from "react";
import * as BsIcon from "react-icons/bs";
import ObjectView from "../../components/view/ObjectViewTemplate";
import * as Components from "./components";
import getDatasetTable  from "../../api/DatasetTable/getDatasetTable";
import useClient from "../../api/client";
import {Loader} from "semantic-ui-react";
import {useParams} from "react-router-dom";

const TableView = (props) => {
    const params = useParams();
    const client= useClient();
    const [table, setTable] = useState({})
    const [loading, setLoading] = useState(true);
    const fetchItem=async  ()=>{
        const response = await client.query(getDatasetTable(params.uri));
        if (!response.errors){
            console.log(response.data.getDatasetTable);
            setTable({...response.data.getDatasetTable});
        }
        setLoading(false);
    }

    useEffect(()=> {
        if (client) {
            fetchItem();
        }
    },[client]);

    return <ObjectView
        title={table.GlueTableName}
        icon={<BsIcon.BsTable/>}
        loading={loading}
        breadcrumbs={`| dataset/${table.dataset&&table.dataset.name}/table/${table.GlueTableName}`}
        label={"xxx"}
        back={{
            link: `/dataset/${table.datasetUri}/`,
            label: `< back to parent dataset ${table&&table.dataset&&table.dataset.name}`
        }}
        owner={table.owner}
        tabs={["overview","preview", "columns"]}
    >
        <Components.Editor client={client}
                           table={{
                               ...table,
                               terms:table.terms&&table.terms.count&&table.terms.nodes||[]
                           }} />
        <Components.TablePreview table={table} client={client}/>
        <Components.TableColumns table={table} client={client}/>
    </ObjectView>
}


export default TableView;
