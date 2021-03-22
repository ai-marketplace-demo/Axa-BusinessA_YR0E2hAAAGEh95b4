import {useState, useEffect} from "react";
import { Button,Dropdown, Menu,Icon,Loader ,Message} from 'semantic-ui-react'
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as ReactIf from "react-if";
import Select from "react-select";
import PagedResponseDefault from "../../../components/defaults/PagedResponseDefault";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Aggegations = ["Sum","Avg","Count","Count Distinct","None","Max","Min"];

const DimensionPanel=({results, config, remove, add})=>{

    const dimensions=[];
    if (results&&results.columns){
        results.columns.forEach((column)=>{
            if (!config.dimensions[column.columnName]){
                dimensions.push({
                    key: column.columnName,
                    value: column.columnName,
                    text: <div onClick={()=>{add({...column})}}>
                        Add <b> {column.columnName} </b> to dimensions
                    </div>
                })
            }
        })
    }

    return <div>
        <div style={{display:'grid', gridTemplateColumns:'1fr auto'}}>
            <b>Dimensions</b>
            <ReactIf.If condition={dimensions.length}>
                <ReactIf.Then>
                    <Button.Group>
                        <Button size={`small`}>Add</Button>
                        <Dropdown
                            className='button icon'
                            floating
                            options={dimensions}
                            trigger={<></>}
                        />
                    </Button.Group>
                </ReactIf.Then>
            </ReactIf.If>

        </div>
        <div style={{display:'grid', marginTop:'1rem',rowGap:'12px',gridTemplateRows:'1fr'}}>
            <ReactIf.If condition={config&&config.dimensions}>
                <ReactIf.Then>
                    {config&&config.dimensions&&Object.values(config.dimensions).map((dimension)=>{
                        return <div style={{
                            display:'grid',
                            columnGap:'8px',
                            placeItems:'',
                            gridTemplateColumns:'3fr 0.4fr'}}>
                            <div style={{fontSize:'medium', fontWeight:'bolder'}}>{dimension.columnName}</div>

                            <Button
                                color={`teal`}
                                icon='eraser'
                                labelPosition='right'
                                content='Remove'
                                size={`mini`} onClick={()=>{remove(dimension)}}/>
                        </div>
                    })}
                </ReactIf.Then>
            </ReactIf.If>
        </div>

    </div>

}
const MeasurePanel=({results, config, remove, update,add})=>{
    const aggOptions=[
           {label:'sum',value:'sum'},
            {label:'avg', value:'avg'}
        ];
    const measures=[];
    if (results&&results.columns){
        results.columns.forEach((column)=>{
            if (!config.measures[column.columnName]){
                measures.push({
                    key: column.columnName,
                    aggregation : {label:'sum', value:'sum'},
                    value: column.columnName,
                    text: <div onClick={()=>{add({...column})}}>
                        Add <b> {column.columnName} </b> to measures
                        </div>
                })
            }

        })
    }

    return <div>
        <div style={{display:'grid', gridTemplateColumns:'1fr auto'}}>
            <b>Measures</b>
            <ReactIf.If condition={measures.length}>
                <ReactIf.Then>
                    <Button.Group>
                    <Button size={`small`}>Add</Button>
                    <Dropdown
                        className='button icon'
                        floating
                        options={measures}
                        trigger={<></>}
                    />
                </Button.Group>
                </ReactIf.Then>
            </ReactIf.If>

        </div>
        <div style={{display:'grid', marginTop:'1rem',rowGap:'12px',gridTemplateRows:'1fr'}}>
            <ReactIf.If condition={config&&config.measures}>
                <ReactIf.Then>
                    {config&&config.measures&&Object.values(config.measures).map((measure)=>{
                        return <div style={{
                            display:'grid',
                            columnGap:'8px',
                            placeItems:'center start ',
                            gridTemplateColumns:'1fr 2fr 0.4fr'}}>
                            <div style={{fontSize:'medium', fontWeight:'lighter'}}>{measure.columnName}</div>
                            <div style={{width:'100%'}}>
                                <Select
                                    onChange={(selectoption)=>{
                                        update({...measure, aggregation:selectoption})
                                    }}
                                    options={aggOptions}
                                    value={measure.aggregation}
                                />
                            </div>
                            <Button
                                color={`teal`}
                                icon='eraser'
                                labelPosition='right'
                                content='Remove'
                                size={`mini`} onClick={()=>{remove(measure)}}/>
                        </div>
                    })}
                </ReactIf.Then>
            </ReactIf.If>
        </div>

    </div>

}

const ChartSettings= ({results,chart})=>{
    const config = chart.config;

    return <div style={{borderLeft:'',display:'block'}}>
        <div style={{
            marginLeft:'1rem',
            marginTop:'1rem',
            placeItems:'center start ',
            display:'grid',gridTemplateColumns:'1fr 1fr'}}>
            <b>Chart type</b>
            <div style={{width:'100%'}} >
                <Select options={[
                    {label:'Line', value:'line'},
                    {label:'Bar', value:'bar'},
                ]}/>
            </div>

        </div>
        <div style={{
            marginLeft:'1rem',
            marginTop:'1rem'
        }}>
           <MeasurePanel
               config={config}
               remove={chart.removeMeasure}
               update={chart.updateMeasure}
               add={chart.addMeasure}
               results={results}/>
        </div>

        <div style={{
            marginLeft:'1rem',
            marginTop:'1rem'
        }}>
            <DimensionPanel
                config={config}
                remove={chart.removeDimension}
                add={chart.addDimension}
                results={results}/>
        </div>


    </div>

}
const ChartPanel = ({toggle,  loading, chart, results})=>{
    const computeChartQuery=()=>{
        const query= `
        with main as (
            ${chart.query}
        )
        select 
            ${Object.values(chart.config.dimensions).map((dim)=>"main."+dim.columnName).join(",")},
            ${Object.values(chart.config.measures).map((measure)=>measure.aggregation.value +"("+measure.columnName+") as "+measure.columnName).join(",")}
        from
            main
        group by 
            ${Object.values(chart.config.dimensions).map((dim)=>dim.columnName).join(",")}
        `
        chart.refresh({query:query});
    }

    const recordToJson = (record)=>{
        const row={};
        record&&record.cells&&record.cells.forEach((cell)=>{
            console.log("CELL = ", cell);
            row[cell.columnName] = cell.value
        });
        console.log("row = ", row);
        return row
    }
    const buildX=()=>{
        const categories=[];
        const records=chart.results.rows.map(r=>recordToJson(r));
        Object.values(chart.config.dimensions).forEach((dimension)=>{
            console.log("dimension = ", dimension);
            records.forEach((record)=>{
                categories.push(record[dimension.columnName])
            })
        })
        return categories;

    }
    const buildSeries=()=>{
        const series=[];
        const records=chart.results.rows.map(r=>recordToJson(r));
        Object.values(chart.config.measures).forEach((measure)=>{
            const serie={
                name:measure.columnName,
                data:records.map(r=>parseFloat(r[measure.columnName]))
            }
            series.push(serie);
        })
        return series;
    }


    return <div
    style={{
        display:'grid',
        columnGap:'1rem',
        gridTemplateColumns:' 3fr 7fr'
    }}>
        <ChartSettings chart={chart} results={results}/>
        <div style={{marginTop:'1rem',placeItems:'start start',display:'grid', gridTemplateRows:'4rem 1fr'}}>
            <div>
                <Button onClick={computeChartQuery} size={`tiny`}>Refresh</Button>
            </div>

            <div>
                <ReactIf.If condition={loading}>
                    <ReactIf.Then>
                        <Loader active={true}/>
                    </ReactIf.Then>
                    <ReactIf.Else>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={{
                                title: {
                                    text: ''
                                },
                                chart: {
                                    type: 'column'
                                },
                                xAxis: {
                                    categories: buildX()
                                },
                                series: buildSeries()

                            }}/>
                    </ReactIf.Else>
                </ReactIf.If>

            </div>
        </div>
    </div>

}


export default ChartPanel;
