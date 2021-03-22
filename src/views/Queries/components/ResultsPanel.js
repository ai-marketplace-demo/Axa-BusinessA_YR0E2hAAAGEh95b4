import {useState, useEffect} from "react";
import { Button,Dropdown, Menu,Icon,Loader ,Message} from 'semantic-ui-react'
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as ReactIf from "react-if";
import PagedResponseDefault from "../../../components/defaults/PagedResponseDefault";
import ResultsTable from "./ResultTable";
import ChartPanel from "./ChartBuilder";
const ResultsPanel = ({toggle,loading, results,chart})=>{
    const [currentView, setCurrentView]= useState("table");
    return <div>
        <div style={{
            padding:'1rem',
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
                <ReactIf.Case condition={currentView=="table"}>
                    <ResultsTable loading={loading} results={results}/>
                </ReactIf.Case>
                <ReactIf.Case condition={currentView=="chart"}>
                    <ChartPanel loading={loading} chart={chart} results={results}/>
                </ReactIf.Case>
            </ReactIf.Switch>
        </div>
    </div>
}


export default ResultsPanel;
