import {useState, useEffect} from "react";
import * as MetricComponents from "../../Metric";


const DatasetMetrics= ({dataset,client})=>{
    return <div style={{display:'grid', gridTemplateColumns:'50% 50%', columnGap:'1rem'}}>
        <MetricComponents.MetricViewer
            title={`Nb Of Tables`}
            client={client}
            filter={{
                metricName:'dataset:tables',
                target:'dhfrprojectstyxzfkeucentral1',//dataset.GlueDatabaseName
            }}
        />
        <MetricComponents.MetricViewer
            title={`Size (in Gb)`}
            client={client}
            filter={{
                metricName:'dataset:size',
                target:'dhfrprojectstyxzfkeucentral1',//dataset.GlueDatabaseName
            }}
        />
    </div>
}
export default DatasetMetrics
