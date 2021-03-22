import {useState,useEffect} from "react";
import useClient from "../../../api/client";
import getSqlPipelineCredsLinux from "../../../api/SqlPipeline/getSqlPipelineCredsLinux";
import {Button,Message,Loader,Table} from "semantic-ui-react";
import * as ReactIf from "react-if";
import listSqlPipelineExecutions from "../../../api/SqlPipeline/listSqlPipelineExecutions";
import startDataProcessingPipeline from "../../../api/SqlPipeline/startPipeline";
import PagedResponseDefault from "../../../components/defaults/PagedResponseDefault"
const ModelRegistry = ({pipeline, client})=>{
    const [items, setItems] = useState(PagedResponseDefault);
    const [isSubmitting, setIsSubmitting]=useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const fetchItems=async ()=>{
        setLoading(true)
        const response = await client.query(listSqlPipelineExecutions ({
            sqlPipelineUri: pipeline.sqlPipelineUri,
            stage:"prod"
        }));
        if (!response.errors){
            setItems(response.data.listSqlPipelineExecutions);
        }
        setLoading(false)
    }

    const runPipeline = async()=>{
        setIsSubmitting(true);
        const response= await client.mutate(startDataProcessingPipeline(pipeline.sqlPipelineUri));
        if (!response.errors){
            setMessage({positive:true,header:'Started',content:"successfully started pipeline"});
        }else {
            setMessage({positive:false,header:'Failed',content:`failed starting  pipeline, received ${response.errors[0].message}`});
        }
        setIsSubmitting(false);

    }
    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client])
    return <>
        <div style={{display:"grid", gridTemplateColumns:'1fr auto auto'}}>
            <div>
                {(isSubmitting||loading)?<Loader active/>:<div/>}
            </div>
            <Button onClick={fetchItems} primary size={`mini`}>Refresh</Button>
            <Button onClick={runPipeline} primary size={`mini`}>Start</Button>
        </div>
        <ReactIf.If condition={message}>
            <ReactIf.Then>
                <Message positive={message&&message.positive}>
                    <Message.Header>{message&&message.header}</Message.Header>
                    <p>{message&&message.content}</p>
                    <Button onClick={()=>{setMessage(null)}} size={`tiny`}>Close</Button>
                </Message>
            </ReactIf.Then>
        </ReactIf.If>
        <Table compact striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                        Name
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Endpoint
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Version
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Status
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Created
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                    {
                        items.nodes.map((item)=>{
                            return <Table.Row>
                                <Table.Cell>
                                    {item.name}
                                </Table.Cell>
                                <Table.Cell>
                                    {item.startDate}
                                </Table.Cell>
                                <Table.Cell>
                                    {item.stopDate}
                                </Table.Cell>
                                <Table.Cell>
                                    {item.status}
                                </Table.Cell>
                                <Table.Cell>
                                    {item.startDate}
                                </Table.Cell>
                            </Table.Row>
                        })
                    }
                </Table.Body>
        </Table>
        </>
}


export default ModelRegistry
