import {useState, useEffect} from "react";
import * as MetricComponents from "../../Metric";


const TableMetrics= ({table,client})=>{
    return <div style={{display:'grid', gridTemplateColumns:'50% 50%', columnGap:'1rem'}}>
        <MetricComponents.MetricViewer
            title={`Nb Of Records`}
            client={client}
            filter={{
                metricName:'table:records',
                target:'dhfrbuildingllvjegeucentral1/nytr',//dataset.GlueDatabaseName
            }}
        />
        <MetricComponents.MetricViewer
            title={`Size (in Gb)`}
            client={client}
            filter={{
                metricName:'table:size',
                target:'dhfrbuildingllvjegeucentral1/nytr',//dataset.GlueDatabaseName
            }}
        />
    </div>
}
export default TableMetrics
