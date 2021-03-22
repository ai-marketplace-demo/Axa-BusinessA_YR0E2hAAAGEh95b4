import {useState, useEffect} from "react";
import * as MetricComponents from "../../Metric";


const PipelineMetrics= ({pipeline,client})=>{
    return <div style={{display:'grid',rowGap:'1rem', gridTemplateColumns:'50% 50%', columnGap:'1rem'}}>
        <MetricComponents.MetricViewer
            title={`Average Duration`}
            client={client}
            filter={{
                metricName:'pipeline:duration',
                target:'sqlrocks',//dataset.GlueDatabaseName,
                aggregation:{
                    AggegationType:'avg',
                    GroupBy:['target','created']
                }
            }}
        />
        <MetricComponents.MetricViewer
            title={`# Records processed`}
            client={client}
            filter={{
                metricName:'pipeline:records',
                target:'sqlrocks',//dataset.GlueDatabaseName
            }}
        />
        <MetricComponents.MetricViewer
            title={`Successfull Executions`}
            client={client}
            filter={{
                metricName:'pipeline:success',
                target:'sqlrocks',//dataset.GlueDatabaseName,
            }}
        />
        <MetricComponents.MetricViewer
            title={`Failed Executions`}
            client={client}
            filter={{
                metricName:'pipeline:error',
                target:'sqlrocks',//dataset.GlueDatabaseName,
            }}
        />

    </div>
}
export default PipelineMetrics
