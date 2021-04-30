import {useState, useEffect} from "react";
import * as Defaults from "../../components/defaults";
import * as MetricApi from "../../api/Metric";
import dayjs from "dayjs";

const MetricViewer = ({client,title,filter})=>{
    const [metrics, setMetrics] = useState(Defaults.PagedResponseDefault);

    const fetchItems = async ()=>{
        const response = await client.query(MetricApi.getMetrics(filter));
        if (!response.errors){
            setMetrics(response.data.getMetrics);
        }
    }
    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client])
    return <div style={{
        borderRadius:'12px',
        //backgroundColor:'rgba(0,0,0,0.07)',
        border:'1px solid lightgrey',
        boxShadow:'0 0 1px 2px rgba(0,0,0,0.05)',
        padding:'8px'}}>
        <div style={{fontSize:'large', fontWeight:'bolder'}}>{title}</div>

    </div>
}


export default MetricViewer;
