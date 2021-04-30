import {useState, useEffect,useRef} from "react";
import * as Defaults from "../../../components/defaults";
import * as ReactIf from "react-if";
import * as WorksheetApi from "../../../api/Worksheet";
import {Table, Input,Loader,Checkbox,Button} from "semantic-ui-react";
import Pager from "../../../components/pager/Pager";

const WorksheetShareManager = ({client, worksheet, api})=>{
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState(Defaults.DefaultFilter);
    const [shareInput, setShareInput] = useState({
        principalType:'User',
        principalId:'',
        canEdit:false
    })
    const [shares, setShares] = useState(Defaults.PagedResponseDefault);

    const fetchItems = async()=>{
        setLoading(true);
        const response = await client.query(WorksheetApi.listWorksheetShares({
            worksheetUri:worksheet.worksheetUri,
            filter:filter
        }));
        if (!response.errors){
            setShares({...response.data.getWorksheet.shares});
        }
        setLoading(false);
    }

    const removeShare=async(worksheetShareUri)=>{
        const response = await client.mutate(WorksheetApi.removeWorksheetShare(worksheetShareUri));
        if (!response.errors){
            fetchItems();
        }

    }

    const updateShare=async()=>{

    }
    const share = async ()=>{
        const response = await client.mutate(WorksheetApi.shareWorksheet({
            worksheetUri:worksheet.worksheetUri,
            input:  shareInput
        }));
        fetchItems();
        setShareInput({principalId:'',canEdit:false,principalType:'User'})
    }
    const handlePageChange=(e,{activePage})=>{
        if (activePage<=shares.page&&activePage!=shares.page){
            setFilter({...filter, page:activePage})
        }
    }
    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client])
    return <div>
       <Pager
           loading={loading}
           count={shares.count}
           pages={shares.pages}
           page={shares.page}
           disableSearch={true}
           onPageChange={handlePageChange}
           />
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                        Email
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Write Permissions
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Action
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {
                    shares.nodes.map((share)=>{
                        return <Table.Row>
                            <Table.Cell>
                                {share.principalId}
                            </Table.Cell>
                            <Table.Cell>
                                <Checkbox readOnly checked={ share.canEdit}/>
                            </Table.Cell>
                            <Table.Cell>
                                <Button basic size={`mini`} onClick={()=>{removeShare(share.worksheetShareUri)}} basic>Remove</Button>
                            </Table.Cell>
                        </Table.Row>
                    })

                }
                <Table.Row>
                    <Table.Cell>
                        <Input
                            placeholder={`Email`}
                            value={shareInput.principalId}
                            onChange={(e)=>{setShareInput({...shareInput, principalId: e.target.value})}}
                        />
                    </Table.Cell>
                    <Table.Cell>
                        <Checkbox
                            onChange={(e)=>{
                                setShareInput({...shareInput, canEdit: !shareInput.canEdit})
                            }}
                            label={`Write/Run`}
                            checked={shareInput.canEdit}/>
                    </Table.Cell>
                    <Table.Cell>
                        <Button  disabled={shareInput.principalId?false:true} basic size={`mini`} onClick={share} primary={true} >Add</Button>
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    </div>
}

export default WorksheetShareManager;
