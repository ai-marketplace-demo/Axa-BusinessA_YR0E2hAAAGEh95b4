import {useState,useEffect} from "react";
import useClient from "../../api/client";
import {Link,useParams,useHistory} from "react-router-dom";
import Select from "react-select";
import {Form, Button, Message, Icon, Table, Input, Segment} from "semantic-ui-react";
import getDataset from "../../api/Dataset/getDataset";
import createShareObject from "../../api/ShareObject/createShareObject";
import getDatasetTable from "../../api/DatasetTable/getDatasetTable";
import listEnvironments from "../../api/Environment/listEnvironments";
import * as ReactIf from "react-if";
import * as FiIcon from "react-icons/fi"
const ShareRequestForm = ()=>{
    const history = useHistory();
    const client = useClient();
    const [message,setMessage] = useState(null);
    const params = useParams();
    const [environmentOptions, setEnvironmentOptions] = useState([]);
    const [currentEnv, setCurrentEnv]=useState();
    const [item, setItem] = useState({});

    const fetchItem = async ()=>{
        let  gql;
        const resolver = (response)=>{
            if (params.kind=="table"){
                return response.data.getDatasetTable
            }else if (params.kind=="dataset"){
                return response.data.getDataset
            }
        }
        if (params.kind=="dataset"){
            gql = getDataset
        }else if (params.kind=="table"){
            gql = getDatasetTable
        }
        const response = await client.query(gql(params.uri));
        if (!response.errors){
            setItem(resolver(response));
        }

    }
    const fetchEnvironments = async () => {
        const response = await client.query(listEnvironments({filter: {roles: ["Admin", "Owner", "Invited", "DatasetCreator"]}}));
        if (!response.errors) {
            setEnvironmentOptions(response.data.listEnvironments.nodes.map((e) => {
                return {...e, value: e.environmentUri, label: `${e.label}(${e.AwsAccountId}:${e.region}) [Group ${e.SamlGroupName}]`};
            }))
        }
    }


    const submit=async ()=>{
        if (params.kind=="dataset"){
            const response= await client.mutate(createShareObject({
                datasetUri:params.uri,
                input:{
                    principalId:currentEnv.value,
                    principalType:'Environment'
                }
            }))
            if (!response.errors){
                setMessage({positive:true,header:'Success', content:'Created share object'})
            }else{
                setMessage({positive:false,header:'Failed', content:`${response.errors[0].message}`})
            }
            return

        }
        if (params.kind=="table"){
            const response= await client.mutate(createShareObject({
                datasetUri:item.datasetUri,
                itemUri: item.tableUri,
                itemType:'DatasetTable',
                input:{
                    principalId:currentEnv.value,
                    principalType:'Environment'
                }
            }))
            if (!response.errors){
                setMessage({positive:true,header:'Success', content:'Created share object'})
            }else {
                setMessage({positive:false,header:'Failed', content:`${response.errors[0].message}`})
            }
            return
        }

        if (params.kind=="folder"){
            const response= await client.mutate(createShareObject({
                datasetUri:item.datasetUri,
                itemUri: item.locationUri,
                itemType:'DatasetStorageLocation',
                input:{
                    principalId:currentEnv.value,
                    principalType:'Environment'
                }
            }))
            if (!response.errors){
                setMessage({positive:true,header:'Success', content:'Created share object'})
            }else {
                setMessage({positive:false,header:'Failed', content:`${response.errors[0].message}`})
            }
            return
        }


    }
    useEffect(()=>{
        if (client){
            fetchItem();
            fetchEnvironments();
        }
    },[client]);


    return <div style={{display:'grid', rowGap:'2rem'}}>
        <Link style={{color:'blue'}} to={`/discover`}>{`< back to catalog`}</Link>


        <div style={{
            display:'grid',
            columnGap:'7px',
            placeItems:'start start',gridTemplateColumns:'2% auto 1fr'}}>
            <div>
                <FiIcon.FiShoppingCart/>
            </div>
            <div style={{color:'dodgerblue',fontSize:'x-large'}}>
                Request Access to {params.kind} {item.name}
            </div>
            <div style={{fontSize:'x-small'}}>{`/contribute/request`}</div>
        </div>
        <Segment style={{borderRadius:'0px'}}>
        <Form>
            <ReactIf.If condition={message}>
                <ReactIf.Then>
                    <Message positive={message&&message.positive}>
                        <Message.Header>
                            {message&&message.header}
                        </Message.Header>
                        <p>
                            {message&&message.content}
                        </p>
                        <Message.Content>
                            <Button icon onClick={()=>{setMessage(null)}}>
                                Close
                                <Icon name={`Close`}/>
                            </Button>
                            <Button onClick={()=>{history.push('/discover')}}>Go back</Button>
                        </Message.Content>
                    </Message>
                </ReactIf.Then>
            </ReactIf.If>
            <Form.Field width={6}>
                <label>{params.kind?.replace(params.kind.charAt(0),params.kind.charAt(0).toUpperCase())}</label>
                <Input
                    value={item.name}
                    readOnly={true}
                    iconPosition={'left'}
                    icon={params.kind === 'dataset' ? 'folder': 'table'}
                />
            </Form.Field>
            <Form.Field width={6}>
                <label>Target Team</label>
                <Select placeholder={`Select target environment`} options={environmentOptions} onChange={(opt)=>{setCurrentEnv(opt)}} value={currentEnv}/>
            </Form.Field>
            <Button disabled={!currentEnv} onClick={submit}  primary >
                Request
            </Button>
        </Form>
        </Segment>

    </div>
}

export default ShareRequestForm;
