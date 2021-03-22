import {useEffect, useState} from "react";
import * as AiIcons from "react-icons/ai";
import * as ReactIf from "react-if";
import PagedResponseDefault from "../../../components/defaults/PagedResponseDefault";
import listDatasetsCreatedInEnvironment from "../../../api/Environment/listDatasetsCreatedInEnvironment";
import listDatasetTables from "../../../api/Dataset/listDatasetTables";
import listDatasetTableColumns from "../../../api/DatasetTable/listDatasetTableColumns";

const ColumnTypeIcon = ({column})=>{
    return <ReactIf.Switch>
        <ReactIf.Case condition={column.typeName.toUpperCase()=="STRING"}>
            <AiIcons.AiOutlineFieldString/>
        </ReactIf.Case>
        <ReactIf.Case condition={['INT','INTEGER','FLOAT','DOUBLE'].indexOf(column.typeName.toUpperCase())!=-1}>
            <AiIcons.AiOutlineFieldNumber/>
        </ReactIf.Case>
        <ReactIf.Default>
            <AiIcons.AiOutlineFieldString/>
        </ReactIf.Default>
    </ReactIf.Switch>
}
const ColumnItem =({dataset, table, column,client})=>{
    return <>
        <div style={{
            paddingLeft:'12px',
            display:"grid",
            gridTemplateRows:'2rem',
            columnGap:'19px',
            gridTemplateColumns:'auto 1fr auto',
            placeItems:'center start'}}>
            <ColumnTypeIcon column={column}/>
            <div style={{fontSize:'xx-small', fontWeight:'lighter'}}>{column.name}</div>
        </div>
        </>
}

const TableBrowserItem =({dataset, table, client})=>{
    const [toggle, setToggle]=useState(false);
    const [columns, setColumns] = useState(PagedResponseDefault);
    const [łoading, setLoading] = useState(true)
    const fetchItems = async()=>{
        setLoading(true);
        const response = await client.query(listDatasetTableColumns ({tableUri:table.tableUri}));
        if (!response.errors){
            setColumns(response.data.listDatasetTableColumns);
        }else {

        }
        setLoading(false);

    }
    useEffect(()=>{
        if (client&&table){
            fetchItems();
        }
    },[client,table]);

    return <>
        <div
            onClick={()=>{setToggle(!toggle)}}
            style={{paddingLeft:'12px',display:"grid", gridTemplateRows:'2rem',columnGap:'12px',gridTemplateColumns:'auto 1fr auto', placeItems:'center start'}}>
        <AiIcons.AiOutlineTable />
        <div style={{fontSize:'smaller', fontWeight:'bold'}}>{table.name} ({columns.count})</div>
        <AiIcons.AiOutlinePlus size={12}/>
    </div>
        <ReactIf.If condition={toggle}>
            <ReactIf.Then>
                <div style={{display:"grid", gridTemplateRows:'1.3rem', gridTemplateColumns:'1fr'}}>
                    {
                        columns.nodes.map((c)=>{
                            return <ColumnItem key={c}  column={c} table={table} dataset={dataset}/>
                        })
                    }
                </div>
            </ReactIf.Then>
            <ReactIf.Else>
                <div/>
            </ReactIf.Else>
        </ReactIf.If>
    </>
}
const DatabaseBrowserItem = ({client, environment,dataset})=>{
    const [toggle, setToggle]=useState(false);
    const [tables, setTables] = useState(PagedResponseDefault);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null);

    const fetchItems=async ()=>{
        setLoading(true);
        const response = await client.query(listDatasetTables({datasetUri:dataset.datasetUri}))
        if (!response.errors){
            setTables({...response.data.getDataset.tables});
        }else {
            setError(response.errors[0].message)
        }
        setLoading(false);
    }
    useEffect(()=>{
        if (client&&environment){
            fetchItems();
        }
    },[client,environment])

    return <>

        <div
            onClick={()=>{setToggle(!toggle)}}
            style={{display:"grid", gridTemplateRows:'auto',columnGap:'12px',gridTemplateColumns:'auto 1fr auto', placeItems:'center start'}}>
            <AiIcons.AiOutlineDatabase />
            <div style={{fontSize:'small', fontWeight:'bolder'}}>{dataset.name} [{dataset.GlueDatabaseName}]({tables.count})</div>
            <AiIcons.AiOutlineDown  size={12}/>
        </div>

        <ReactIf.If condition={toggle&&tables.count}>
            <ReactIf.Then>
                <div style={{display:"grid", gridTemplateRows:'1.3rem', gridTemplateColumns:'1fr'}}>
                    {
                        tables.nodes.map((t)=>{
                            return <TableBrowserItem client={client} key={t.tableUri}  table={t} dataset={dataset}/>
                        })
                    }
                </div>
            </ReactIf.Then>
            <ReactIf.Else>
                <div/>
            </ReactIf.Else>
        </ReactIf.If>
    </>


}

const DatabaseBrowser = ({environment, client})=>{
    const [datasets, setDatasets] = useState(PagedResponseDefault);
    const [term, setTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        term :"",
        page:1,
        pageSize:50
    })

    const next=()=>{
        if (datasets.hasNext){
            setFilter({...filter, page:filter.page+1});
            fetchItems();
        }
    }
    const previous=()=>{
        if (datasets.hasPrevious){
            setFilter({...filter, page:filter.page-1});
            fetchItems();
        }
    }
    const fetchItems=async ()=>{
        setLoading(true);
        const response= await client.query(listDatasetsCreatedInEnvironment({
            environmentUri:environment.value,
            filter:filter
        }))
        if (!response.errors){
            setDatasets({...response.data.listDatasetsCreatedInEnvironment});
        }
        setLoading(false);
    }

    const handleSearch=async (e)=>{
        if (e.key=="Enter"){
            await setFilter({...filter, page:1})
            await fetchItems();
        }

    }
    useEffect(()=>{
        if (environment&&client){
            fetchItems();
        }
    },[environment,client]);


    if (!environment){
        return <div/>
    }
    return <div style={{height:'auto',overflowY:'scroll',display:'block'}}>
        <div style={{fontSize:'xx-small',display:"grid", placeItems:'center center',gridTemplateColumns:'1fr 1fr 1fr'}}>
            <div style={{color:'dodgerblue'}} onClick={previous}>prev</div>
            <div> {datasets.page}/{datasets.pages}</div>
            <div style={{color:'dodgerblue'}} onClick={next}>next</div>
        </div>
        <input
            style={{width:'100%'}}
            onKeyPress={handleSearch}
            value={filter.term}
            onChange={(e)=>{setFilter({...filter, term:e.target.value})}}
        />
        <div style={{fontSize:'xx-small'}}>
            {datasets.count} database(s)
        </div>
        <ReactIf.If condition={environment}>
            <ReactIf.Then>
                {
                    datasets.nodes.map((d)=>{
                        return <DatabaseBrowserItem client={client} key={d.datasetUri} environment={environment} dataset={d}/>
                    })
                }
            </ReactIf.Then>
            <ReactIf.Else>
                <div/>
            </ReactIf.Else>
        </ReactIf.If>

    </div>
}
export default DatabaseBrowser;
