import React, {useEffect, useState} from "react";
import useClient from "../../../api/client";
import getDatasetTableProfilingRun from "../../../api/DatasetTable/getDatasetTableProfilingRun";
import startDatasetProfilingRun from "../../../api/DatasetTable/startProfilingRun";
import { linearGradientDef } from '@nivo/core'
import {
    Button,
    Container,
    Divider,
    Grid,
    Label,
    Loader,
    Menu,
    Progress,
    Segment,
    Header,
    Icon, Message
} from "semantic-ui-react";
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveChoropleth } from '@nivo/geo';
import countries from "./world_countries.json";
import datalake_regions from "./datalake_regions.json";
import listDatasetTableProfilingRuns from "../../../api/DatasetTable/listDatasetTableProfilingRuns";
const TableMetrics =({table})=>{
    const client =  useClient();
    const [ready, setReady] = useState(false);
    const [metrics, setMetrics] = useState(null);
    const [runs, setRuns] = useState({count: 0, page: 1, pages: 1, hasNext: false, hasPrevious: false, nodes: []});
    const [listingRuns, setListingRuns] = useState(false);
    const [message, setMessage] = useState(null);
    const [column, setColumn] = useState(null);
    const [profiling, setProfiling] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    const [regionData, setRegionData] = useState([]);
    const [regionName, setRegionName] = useState('');
    const handleItemClick = async (e, { name }) => {
        setActiveItem(name);
        setColumn(metrics.columns.filter(obj => {
            return obj.Name === name
        })[0])
        console.log("column", column)
    }
    const statusColor = (status) => {
        let color = 'blue';
        switch (status) {
            case 'SUCCEEDED':
                color = 'green';
                break;
            case'UNKNOWN':
            case'FAILED':
            case'STOPPED':
                color = 'red';
                break;
            case 'RUNNING':
                color = 'blue';
                break;
            default:
                color = 'blue';
        }
        return color;
    };

    const fetchData=async ()=>{
        setReady(false);
        const response = await client.query(getDatasetTableProfilingRun(table.tableUri));
        if (!response.errors) {
            if (response.data.getDatasetTableProfilingRun && response.data.getDatasetTableProfilingRun.results) {
                const res = JSON.parse(response.data.getDatasetTableProfilingRun.results);
                getRegionData(res);
                setMetrics(res);
                setColumn(res?.columns[0])
                setActiveItem(res?.columns[0]?.Name)
            }
        }
        else{
            setMessage({
                negative: true,
                header: `Table Metrics`,
                content: `Failed to retrieve table metrics: ${response.errors[0].message}`
            })
        }
        setReady(true);
    };

    const listProfilingRuns=async ()=>{
        setListingRuns(false);
        const response = await client.query(listDatasetTableProfilingRuns(table.tableUri));
        if (!response.errors){
            setRuns({...response.data.listDatasetTableProfilingRuns})
        }else {
            setMessage({
                negative: true,
                header: `Table Metrics`,
                content: `Could not retrieve profiling job runs ${response.errors[0].message}`
            })
        }
        setListingRuns(true);
    };

    const startProfilingRun=async ()=>{
        setProfiling(true);
        const response = await client.mutate(startDatasetProfilingRun({input:
                { datasetUri: table.datasetUri, tableUri: table.tableUri}}));
        if (!response.errors){
            setMessage({
                positive: true,
                header: `Table Metrics`,
                content: `Profiling started.`
            })
            listProfilingRuns();

        }else{
            setMessage({
                negative: true,
                header: `Table Metrics`,
                content: `Failed to start profiling. ${response.errors[0].message}`
            })
        }
        setProfiling(false);
    };
    
    const getRegionData = (metrics) => {
        let data = [];
        let region_name = '';
        let region_id = metrics && metrics.regionId?.length === 1 ?  metrics.regionId[0] : 5
        switch (metrics && region_id) {
            case 1:
                data = datalake_regions.NA.countries;
                region_name = datalake_regions.NA.region_name;
                break;
            case 2:
                data = datalake_regions.EU.countries;
                region_name = datalake_regions.EU.region_name;
                break;
            case 3:
                data = datalake_regions.EAST.countries;
                region_name = datalake_regions.EAST.region_name;
                break;
            case 4:
                data = datalake_regions.INDIA.countries;
                region_name = datalake_regions.INDIA.region_name;
                break;
            default:
                data = datalake_regions.ALL.countries;
                region_name = datalake_regions.ALL.region_name;
        }
        setRegionData(data);
        setRegionName(region_name);
    }

    useEffect(()=>{
        if (client){
            listProfilingRuns();
            fetchData();
        }
    },[client,table]);
    if (!ready){
        return <div
            style={{
                width:'1fr',
                display:'block',
                height:'100%'
            }}
        >
            <Loader active/>
        </div>
    }
    const isAdmin = () => {
        return ["Creator", "Admin", "Owner"].indexOf(table?.dataset?.userRoleForDataset) === -1 ? false : true
    }
    return <div>
        {message && <Message positive={message.positive} negative={message.negative} onDismiss={() => setMessage(null)}>
            <Message.Header>{message.header}</Message.Header>
            <Message.Content>
                <p>{message.content}</p>
            </Message.Content>
        </Message>
        }
        <div>
            {isAdmin() && <Segment style={{borderRadius: "0px"}}>
                <Grid>
                    <Grid.Column width={13}>
                        {metrics || runs.nodes.length > 0 ?
                            <div>
                                <div>
                                    <b>Last job run</b>
                                        <Label circular
                                               color={statusColor(runs?.nodes[0]?.status)}
                                               size={'small'}>
                                            {runs?.nodes[0]?.status}
                                        </Label>
                                </div>
                            </div>:<Message info={true} content={<b>Run profiling job to get table metrics.</b>}/>
                        }
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Button icon loading={profiling} color={'blue'} size={'small'} labelPosition='left' onClick={()=>{startProfilingRun()}}>
                            <Icon name='play'/>Run Profiling
                        </Button>
                        <Button icon='sync alt' size={'small'} basic color={'blue'} onClick={()=>{listProfilingRuns(); fetchData()}}/>
                    </Grid.Column>
                </Grid>
            </Segment>}
            {metrics && <div>
                <Grid>
                    <Grid.Column width={8}>
                        <Segment style={{borderRadius: "0px", height: 500}}>
                            <div><span><h2>Summary</h2></span></div>
                            <div>{table.name}</div>
                            <ResponsivePie
                                data={[
                                    {"id": "Rows","label": "Rows","fixed": 50, "metrics":metrics?.table_nb_rows || 0},
                                    {"id": "Columns","label": "Columns","fixed": 25, "metrics":metrics?.columns.length || 0},
                                    {"id": "DataTypes","label": "DataTypes","fixed": 25, "metrics": metrics?.dataTypes?.length || 0}
                                ]}
                                value={'fixed'}
                                sliceLabel={d => `${d.data.metrics}`}
                                margin={{ top: 20, right: 80, bottom: 120, left: 80 }}
                                innerRadius={0.5}
                                padAngle={8}
                                cornerRadius={3}
                                colors={'#2171b5'}
                                borderWidth={0.5}
                                borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.9 ] ] }}
                                radialLabelsSkipAngle={10}
                                radialLabelsTextColor="#333333"
                                radialLabelsLinkColor={{ from: 'color' }}
                                sliceLabelsSkipAngle={10}
                                sliceLabelsTextColor="white"
                                isInteractive={false}
                                sortByValue={true}
                                defs={[
                                    linearGradientDef('gradientA', [
                                        { offset: 0, color: '#c6dbef' },
                                        { offset: 50, color: '#c6dbef' },
                                    ]),
                                    linearGradientDef('gradientB', [
                                        { offset: 0, color: '#08519c' },
                                        { offset: 50, color: '#08519c' },
                                    ]),

                                    {
                                        id: 'gradientC',
                                        type: 'linearGradient',
                                        colors: [
                                            { offset: 0, color: '#2171b5' },
                                            { offset: 50, color: '#2171b5' },
                                        ],
                                    },
                                ]}
                                fill={[
                                    { match: { id: 'DataTypes' }, id: 'gradientA' },
                                    { match: { id: 'Rows' }, id: 'gradientB' },
                                    { match: '*', id: 'gradientC' },
                                ]}
                                legends={[
                                    {
                                        anchor: 'bottom',
                                        direction: 'row',
                                        justify: false,
                                        translateX: 0,
                                        translateY: 56,
                                        itemsSpacing: 0,
                                        itemWidth: 100,
                                        itemHeight: 18,
                                        itemTextColor: '#999',
                                        itemDirection: 'left-to-right',
                                        itemOpacity: 1,
                                        symbolSize: 18,
                                        symbolShape: 'circle',
                                        effects: [
                                            {
                                                on: 'hover',
                                                style: {
                                                    itemTextColor: '#000'
                                                }
                                            }
                                        ]
                                    }
                                ]}
                            />
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Segment style={{borderRadius: "0px", height: 500}}>
                            <div><span><h2>Region</h2></span></div>
                            <div>{regionName}</div>
                            <div style={{ height: 400 }}>
                                <ResponsiveChoropleth
                                    data={regionData}
                                    features={countries.features}
                                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                                    colors="blues"
                                    domain={[ 0, 4 ]}
                                    unknownColor="#D0D0D0"
                                    label="properties.name"
                                    valueFormat=".2s"
                                    projectionTranslation={[ 0.5, 0.5 ]}
                                    projectionRotation={[ 0, 0, 0 ]}
                                    enableGraticule={true}
                                    graticuleLineColor="#dddddd"
                                    borderWidth={0.5}
                                    isInteractive={false}
                                    borderColor="#152538"
                                />
                            </div>
                        </Segment>
                    </Grid.Column>
                </Grid>


            <Grid>
                <Grid.Column width={4}>
                    <Menu vertical size='huge' style={{borderRadius: "0px"}}>
                        {metrics.columns.map((column) => {
                            return <Menu.Item
                                name={column.Name}
                                active={activeItem === column.Name}
                                onClick={handleItemClick}
                            >
                                <Label>{column.Type}</Label>
                                {column.Name.substring(0, 22)}
                            </Menu.Item>
                        })}
                    </Menu>
                </Grid.Column>
                {column && <Grid.Column width={12}>
                    <Segment style={{borderRadius: "0px"}}>
                        <Grid>
                            <Grid.Column width={2}>
                                <span>{column.Type}</span>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <h2>{column.Name}</h2>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                    <Segment style={{borderRadius: "0px"}}>
                        <div><span><h3>Data Quality</h3></span></div>
                        <Progress size={'small'} color={'blue'} percent={Math.trunc(column?.Metadata?.Completeness * 100)}
                                  progress/>
                        <Grid>
                            <Grid.Column width={12}>
                                <Label circular color={'blue'} key={'blue'}>
                                    {Math.trunc(column?.Metadata?.Completeness * 100)}
                                </Label><span><b>VALID VALUES</b></span>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Label circular>
                                    {((1 - column?.Metadata?.Completeness) * 100).toFixed(0)}
                                </Label><span><b>MISSING VALUES</b></span>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                    <Segment style={{borderRadius: "0px"}}>
                        <span><h3>Value Distribution</h3></span>
                        {column.Metadata?.Maximum !== "None" && column.Metadata?.Minimum !== "None" ? (
                            <div style={{ height: 400 }}>
                            <ResponsiveBar
                                data={[
                                        {"dist": "stdDev", "stdDev":column?.Metadata?.StdDeviation ? column?.Metadata?.StdDeviation: 0},
                                        {"dist": "max", "max":column?.Metadata?.Maximum ? column?.Metadata?.Maximum : 0},
                                        {"dist": "mean", "mean":column?.Metadata?.Mean ? column?.Metadata?.Mean : 0},
                                        {"dist": "min", "min":column?.Metadata?.Minimum ? column?.Metadata?.Minimum : 0},
                                    ]}
                                keys={["min", "mean", "max", "stdDev"]}
                                indexBy="dist"
                                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                                padding={0.6}
                                valueScale={{ type: 'linear' }}
                                indexScale={{ type: 'band', round: true }}
                                colors={{ scheme: 'blues' }}
                                borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                                axisTop={null}
                                axisRight={null}
                                enableLabel={false}
                                labelSkipWidth={12}
                                labelSkipHeight={12}
                                labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                                legends={[
                                    {
                                        dataFrom: 'keys',
                                        anchor: 'bottom-right',
                                        direction: 'column',
                                        justify: false,
                                        translateX: 120,
                                        translateY: 0,
                                        itemsSpacing: 2,
                                        itemWidth: 100,
                                        itemHeight: 20,
                                        itemDirection: 'left-to-right',
                                        itemOpacity: 0.85,
                                        symbolSize: 20,
                                        effects: [
                                            {
                                                on: 'hover',
                                                style: {
                                                    itemOpacity: 1
                                                }
                                            }
                                        ]
                                    }
                                ]}
                                animate={true}
                                motionStiffness={90}
                                motionDamping={15}
                                defs={[
                                    // using helpers
                                    // will inherit colors from current element
                                    linearGradientDef('gradientA', [
                                        { offset: 0, color: '#c6dbef' },
                                        { offset: 50, color: '#c6dbef' },
                                    ]),
                                    linearGradientDef('gradientB', [
                                        { offset: 0, color: '#08519c' },
                                        { offset: 50, color: '#08519c' },
                                    ]),
                                    linearGradientDef('gradientD', [
                                        { offset: 0, color: '#6baed6' },
                                        { offset: 50, color: '#6baed6' },
                                    ]),
                                    {
                                        id: 'gradientC',
                                        type: 'linearGradient',
                                        colors: [
                                            { offset: 0, color: '#2171b5' },
                                            { offset: 50, color: '#2171b5' },
                                        ],
                                    },
                                ]}
                                fill={[
                                    { match: { id: 'mean' }, id: 'gradientD' },
                                    { match: { id: 'max' }, id: 'gradientB' },
                                    { match: { id: 'min' }, id: 'gradientA' },
                                    { match: '*', id: 'gradientC' },
                                ]}

                            />
                        </div>):<span style={{marginLeft:'2.5px'}}>No data available</span>}
                    </Segment>
                        <Segment style={{borderRadius: "0px"}}>
                        <div><span><h3>Histogram</h3></span></div>
                            {column.Metadata?.Histogram && column.Metadata?.Histogram.length > 0 ?(
                                <div style={{ height: 400 }}>
                                <ResponsiveBar
                                    data={column?.Metadata?.Histogram.map((r) => ({"value": r.value, [r.value]: r.count}))}
                                    keys={column?.Metadata?.Histogram.map((r) => [r.value])}
                                    indexBy="value"
                                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                                    padding={0.3}
                                    valueScale={{ type: 'linear' }}
                                    indexScale={{ type: 'band', round: true }}
                                    colors={{ scheme: 'blues' }}
                                    borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'values',
                                        legendPosition: 'middle',
                                        legendOffset: 32
                                    }}
                                    axisLeft={{
                                        tickSize: 2,
                                        tickPadding: 2,
                                        tickRotation: 0,
                                        legend: 'occurrences',
                                        legendPosition: 'middle',
                                        legendOffset: -55
                                    }}
                                    enableLabel={false}
                                    labelSkipWidth={12}
                                    labelSkipHeight={12}
                                    labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                                    legends={[
                                        {
                                            dataFrom: 'keys',
                                            anchor: 'bottom-right',
                                            direction: 'column',
                                            justify: false,
                                            translateX: 120,
                                            translateY: 0,
                                            itemsSpacing: 2,
                                            itemWidth: 100,
                                            itemHeight: 20,
                                            itemDirection: 'left-to-right',
                                            itemOpacity: 0.85,
                                            symbolSize: 20,
                                            effects: [
                                                {
                                                    on: 'hover',
                                                    style: {
                                                        itemOpacity: 1
                                                    }
                                                }
                                            ]
                                        }
                                    ]}
                                    animate={true}
                                    motionStiffness={90}
                                    motionDamping={15}
                                />
                            </div>):<span style={{marginLeft:'2.5px'}}>No data available</span>}
                    </Segment>
                </Grid.Column>
                }
            </Grid></div>}
        </div>
    </div>
};


export default TableMetrics;
