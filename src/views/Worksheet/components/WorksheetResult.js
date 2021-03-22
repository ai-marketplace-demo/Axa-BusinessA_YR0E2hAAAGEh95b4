import {useState} from "react";
import {Button, Icon,Form} from "semantic-ui-react";
import * as ReactIf from "react-if";
import * as FiIcons from "react-icons/fi";
import DatabaseBrowser from "./DatabaseBrowser";
import ResultTable from "./ResultTable";
import ChartPanel from "./ChartBuilder2";
import {Zoomable} from "../../../components/Zoomable"
import TagEditor from "../../../components/TagEditor/TagEditor";

const WorksheetResult = ({worksheet,maximized,results,environment,toggle,client,onChange})=>{
    const [current, setCurrent] = useState("Results");
    const [environmentOptions, setEnvironmentOptions] = useState([]);
    const [currentEnv, setCurrentEnv]=useState();
    const switchResult=()=>{
        setCurrent("Results");
    }
    const switchInfo=()=>{
        setCurrent("Info");
    }
    const switchSchema=()=>{
        setCurrent("Schema");
    }
    const switchChart=()=>{
        setCurrent("Chart");
    }



    return <div style={{overflowY:'scroll',rowGap:'1rem',paddingTop:'1rem',borderTop:'1px solid lightgrey',display:'grid', gridTemplateRows:'20% 80%'}}>
        <div style={{display:'grid', gridTemplateColumns:'90% 10%'}}>
            <div style={{display:'grid', columnGap:'2rem',gridTemplateColumns:'repeat(3,auto) 1fr'}}>
                <Button icon labelPosition={`right`} compact basic color={current=="Results"?"blue":"grey"}  onClick={switchResult}>
                    Results
                    <Icon name={`bars`}/>
                </Button>
                <Button icon labelPosition={`right`} compact basic color={current=="Info"?"blue":"grey"}  onClick={switchInfo}>
                    Info
                    <Icon name={`info circle`}/>
                </Button>
                {/**
                <Button icon labelPosition={`right`}compact basic color={current=="Chart"?"blue":"grey"}  onClick={switchChart}>
                    Chart
                    <Icon name={`lightbulb outline`}/>
                </Button>
                 **/}
                <Button icon labelPosition={`right`} compact basic  color={current=="Schema"?"blue":"grey"}  onClick={switchSchema}>
                    Schema
                    <Icon name={`database`}/>
                </Button>
            </div>
            <div>
                <Button size={`tiny`} compact color={`green`}>
                    {maximized?"Minimize":"Maximimize"}
                </Button>
            </div>
        </div>
        <div style={{width:'100%', overflowX:'scroll'}}>
            <ReactIf.Switch>
                <ReactIf.Case condition={current==="Schema"}>
                    <DatabaseBrowser
                        client={client}
                        environment={environment}
                    />
                </ReactIf.Case>
                <ReactIf.Case condition={current=="Results"}>
                    <ResultTable
                    results={results}
                    loading={false}
                    />
                </ReactIf.Case>
                <ReactIf.Case condition={current=="Info"}>
                        <Form>
                            <Form.Field>
                                <label>Description</label>
                                <input value={worksheet.description}
                                       onChange={(e)=>{onChange({...worksheet, description:e.target.value})}}
                                       placeholder='Description' />
                            </Form.Field>
                            <Form.Field>
                                <label>Tags</label>
                                <TagEditor
                                    onChange={(e)=>{onChange({...worksheet, tags:e.target.value})}}
                                    tags={worksheet.tags||[]}/>
                            </Form.Field>
                    </Form>
                </ReactIf.Case>
                <ReactIf.Case condition={current=="Chart"}>
                    <ChartPanel
                        onChange={onChange}
                        results={results}
                        worksheet={worksheet}
                    />
                </ReactIf.Case>
            </ReactIf.Switch>
        </div>
    </div>
}


export default WorksheetResult;
