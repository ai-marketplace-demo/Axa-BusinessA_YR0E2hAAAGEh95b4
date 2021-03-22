import {useState} from "react";
import {Button, Icon} from 'semantic-ui-react'
import * as ReactIf from "react-if";
import ResultsTable from "./ResultTable";
import ChartPanel from "./ChartBuilder2";



const ResultsPanel = ({toggle,loading, results,worksheet})=>{
    const [currentView, setCurrentView]= useState("table");
    return <div>
        <div draggable={true} style={{
            padding:'1rem',
            marginTop:'2rem',
            backgroundColor:'rgba(0,0,0,0.05)',
            borderTop:'1px solid lightgrey',
            borderBottom:'1px solid lightgrey',
            //height:'3rem',
            display:'grid',
            gridTemplateColumns:'repeat(2,12%) 1fr auto'}}>

            <Button
                onClick={()=>{setCurrentView(("table"))}}
                size={`mini`}  icon labelPosition='right'>
                <Icon name={"ellipsis horizontal"}/>
                Results
            </Button>
            <Button
                onClick={()=>{setCurrentView(("chart"))}}
                size={`mini`} icon labelPosition='right'>
                <Icon name={`lightbulb outline`}/>
                Chart
            </Button>
            <div/>
            <Button color={`white`} size={`tiny`} onClick={toggle} circular icon='window maximize outline' />
        </div>
        <div style={{height:'4rem'}}>
            <ReactIf.Switch>
                <ReactIf.Case condition={currentView==="table"}>
                    <ResultsTable loading={loading} results={results}/>
                </ReactIf.Case>
                <ReactIf.Case condition={currentView==="chart"}>
                    <ChartPanel onChange={onchange} loading={loading} worksheet={worksheet} results={results}/>
                </ReactIf.Case>
            </ReactIf.Switch>
        </div>
    </div>
}


export default ResultsPanel;
