import {useState, useEffect} from "react";
import * as Defaults from "../../components/defaults";
import * as MetricApi from "../../api/Metric";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
import T from "highcharts/themes/sand-signika";
import dayjs from "dayjs";

const MetricViewer = ({client,title,filter})=>{
    const [metrics, setMetrics] = useState(Defaults.PagedResponseDefault);
    //T(Highcharts)
    const chartOptions=()=>{
        const options = {
            title: {
                text: '',

            },
            chart:{
                height:'200px'
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            },
            xAxis:{
               labels:{
                   rotation:-45,
                   style:{
                       fontSize:'smaller'
                   }
               },
                categories:metrics.nodes.map((m)=>{return dayjs(m.created).format("DD-MM-YYYY")})
            },
            series: [{
                name:'date',
                showInLegend: false,
                type: 'spline',
                data: metrics.nodes.map((m)=>{return m.metricValue})
            }]
        };
        return options;
    }

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
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions()}
        />
    </div>
}


export default MetricViewer;
