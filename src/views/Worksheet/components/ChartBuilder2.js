import * as ReactIf from "react-if";
import {Button, Icon,Dropdown,Select} from "semantic-ui-react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


const DimensionPanel = ({worksheet, results, onChange})=>{

    const removeDimension=(dimension)=>{
        onChange({
            ...worksheet,
            chartConfig: {
                ...worksheet.chartConfig,
                dimensions:worksheet.chartConfig.dimensions.filter((column)=>{
                    return column.columnName!==dimension.columnName
                })
            }
        })

    }
    const addDimension=(dimension)=>{
        onChange({
            ...worksheet,
            chartConfig:{
                ...worksheet.chartConfig,
                dimensions:[
                    ...worksheet.chartConfig.dimensions,
                    {
                        columnName:dimension
                    }
                ]
            }
        })
    }
    const currentChartDimensions= Object.fromEntries(worksheet.chartConfig.dimensions.map((dimension)=>{
        return [dimension.columnName, dimension];
    }));

    const dimensionOptions = results
        .columns
        .filter((column)=>{
            return !currentChartDimensions[column.columnName]
        })
        .filter((column)=>{
            return column.typeName==="varchar"
        })
        .map((column)=>{
            return {
                key : column.columnName,
                text:<div onClick={()=>{addDimension(column.columnName)}}>
                    {column.columnName}
                </div>
            }
        })
    return <div style={{
        display:'grid'
    }}>
        <div style={{display:'grid', placeItems:'center start',gridTemplateColumns:'1fr 1fr'}}>
            <div style={{fontSize:'large', fontWeight:'bolder'}}>
                Dimensions
            </div>
            <ReactIf.If condition={dimensionOptions.length}>
                <ReactIf.Then>
                    <Button.Group>
                        <Button compact size={`small`}>Add</Button>
                        <Dropdown
                            compact
                            className='button icon'
                            floating
                            options={dimensionOptions}
                            trigger={<></>}
                        />
                    </Button.Group>
                </ReactIf.Then>
            </ReactIf.If>
        </div>
        {
            worksheet.chartConfig.dimensions.map((dimension)=>{
                return <div style={{
                    display:'grid',
                    columnGap:'8px',
                    placeItems:'center start ',
                    gridTemplateColumns:'1fr  0.4fr'}}>
                    <div style={{fontSize:'medium', fontWeight:'lighter'}}>{dimension.columnName}</div>
                    <Button
                        color={`teal`}
                        icon='eraser'
                        labelPosition='right'
                        content='Remove'
                        size={`mini`} onClick={()=>{removeDimension(dimension)}}/>
                </div>
            })
        }
    </div>

}

const MeasurePanel = ({worksheet, results, onChange})=>{
    const updateMeasure=({measure, agg})=>{
        onChange({
            ...worksheet,
            chartConfig: {
                ...worksheet.chartConfig,
                measures: worksheet.chartConfig.measures.map((column)=>{
                    if (column.columnName==measure.columnName){
                        return {
                            ...column,
                            aggregationName: agg
                        }
                    }
                    return column;
                })
            }
        })
    }
    const removeMeasure=(measure)=>{
        onChange({
            ...worksheet,
            chartConfig: {
                ...worksheet.chartConfig,
                measures:worksheet.chartConfig.measures.filter((column)=>{
                    return column.columnName!==measure.columnName
                })
            }
        })

    }
    const addMeasure=(measure)=>{
        onChange({
            ...worksheet,
            chartConfig:{
                ...worksheet.chartConfig,
                measures:[
                    ...worksheet.chartConfig.measures,
                    {
                        columnName:measure
                    }
                ]
            }
        })
    }
    const currentChartMeasures= Object.fromEntries(worksheet.chartConfig.measures.map((measure)=>{
        return [measure.columnName, measure];
    }))

    const measureOptions = results
        .columns
        .filter((column)=>{
            return !currentChartMeasures[column.columnName]
        })
        .filter((column)=>{
            return column.typeName!="varchar"
        })
        .map((column)=>{
            return {
                key : column.columnName,
                text:<div onClick={()=>{addMeasure(column.columnName)}}>
                    {column.columnName}
                </div>
        }
    })

    return <div style={{
        display:'grid'
    }}>
        <div style={{display:'grid', rowGap:'9px',placeItems:'center start',gridTemplateColumns:'1fr 1fr'}}>
            <div style={{fontSize:'large', fontWeight:'bolder'}}>
                Measures
            </div>
            <ReactIf.If condition={measureOptions.length}>
                <ReactIf.Then>
                    <Button.Group>
                        <Button compact size={`small`}>Add</Button>
                        <Dropdown
                            compact={true}
                            className='button icon'
                            floating
                            options={measureOptions}
                            trigger={<></>}
                        />
                    </Button.Group>
                </ReactIf.Then>
            </ReactIf.If>
        </div>
        {
            worksheet.chartConfig.measures.map((measure)=>{
                return <div style={{
                    width:'100%',
                    marginTop:'1rem',
                    display:'grid',
                    columnGap:'8px',
                    rowGap:'8px',
                    placeItems:'center start ',
                    gridTemplateColumns:'2fr 1fr 1fr'}}
                >
                    <div style={{fontSize:'medium', fontWeight:'lighter'}}>{measure.columnName}</div>
                        <Select
                            onChange={(e,{value})=>{updateMeasure({measure,agg:value})}}
                            value={measure.aggregationName}
                            options={[
                                {key:'sum', value:'sum',text:'sum'},
                                {key:'avg', value:'avg',text:'average'},
                                {key:'max', value:'max',text:'max'},
                                {key:'min', value:'min',text:'min'},
                             ]}
                            placeholder={`Select Aggregation`}/>
                    <Button
                        color={`orange`}
                        icon='eraser'
                        labelPosition='right'
                        content='Remove'
                        size={`mini`}
                        onClick={()=>{removeMeasure(measure)}}
                    />
                </div>
            })
        }
    </div>
}

const ChartSettings= ({results,worksheet,onChange})=>{

    return <div style={{borderLeft:'',display:'block'}}>
        <div style={{
            marginLeft:'1rem',
            marginTop:'1rem',
            placeItems:'center start ',
            display:'grid',gridTemplateColumns:'2fr 1fr'}}>
            <div>
                <b>Chart type</b>
            </div>
                <Select
                   onChange={(e,{value})=>{
                       onChange({...worksheet, chartConfig: {...worksheet.chartConfig,chartType:value}})
                   }}
                    options={[
                        {   key:'line',text:'line',value:'line'},
                        {   key:'bar', text:'bar',value:'bar'}
                    ]}/>
        </div>
        <div style={{
            marginLeft:'1rem',
            display:'grid',
            rowGap:'1rem',
            marginTop:'1rem'
        }}>
            <MeasurePanel
                worksheet={worksheet}
                onChange={onChange}
                results={results}/>
            <DimensionPanel
                worksheet={worksheet}
                onChange={onChange}
                results={results}
            />
        </div>


    </div>

}
const ChartPanel = ({worksheet,results,currentQuery,onChange})=>{
    const chartQueryResults = [];
    return <div
        style={{
            display:'grid',
            columnGap:'1rem',
            gridTemplateRows:'1fr',
            gridTemplateColumns:'1fr 2fr'
        }}>

       <div style={{borderRight:'1px solid lightgrey', padding:'2rem'}}>
           <ChartSettings worksheet={worksheet} results={results} onChange={onChange}/>
       </div>
        <div style={{display:'grid', gridTemplateRows:'auto 1fr'}}>
            <div style={{display:'grid', gridTemplateColumns:' 1fr auto 2rem'}}>
                <div/>
                <Button size={`mini`} color={`teal`} icon labelPosition={'right'} basic>Run <Icon name={`play`}/></Button>
            </div>
            <div style={{width:'1fr', overflowX:'scroll'}}>
                <HighchartsReact
                    highcharts={Highcharts}
                    option={{}}
                    />
            </div>
        </div>

    </div>
}
export default ChartPanel;
