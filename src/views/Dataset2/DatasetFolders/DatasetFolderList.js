import React, {useState, useEffect} from "react";
import {Container, Row, Col, Table, Spinner, Badge} from "react-bootstrap";
import {If, Then , Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import listDatasetStorageLocations from "../../../api/Dataset/listDatasetStorageLocations";
import DatasetFolderListITem from "./DatasetFolderListItem";
import DatasetFolderForm  from "./DatasetFolderForm";
import useClient from "../../../api/client";
import {toast} from "react-toastify";



const DatasetFolderList = (props)=>{
    const client = useClient();
    const [loading, setLoading] = useState(false);
    const [mode,setMode] = useState("list");
    const [folders, setFolders] = useState({
        count:0,
        page:1,
        pages:1,
        hasNext: false,
        hasPrevious:false,
        nodes:[]
    });


    const fetchItems =async ()=>{
        setLoading(true);
        const response= await client.query(listDatasetStorageLocations (props.dataset.datasetUri));
        if (!response.errors){
            setFolders({...response.data.getDataset.locations});
        }else{
            toast(`Could not retrieve folders, received ${response.errors[0].message}`);
        }
        setLoading(false);
    }


    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client])

    if (mode=="form"){
        return <DatasetFolderForm dataset={props.dataset} close={()=>{setMode("")}}/>
    }
    return <Container fluid>
        <Row>
            <Col xs={2}>
                <div onClick={()=>{setMode("form")}} className={`btn btn-sm btn-primary rounded-pill`}>
                    Create Folder
                </div>
            </Col>
            <Col xs={8}></Col>
            <Col xs={1}>
                <If condition={loading}>
                    <Then>
                        <Spinner variant={`secondary`} animation={`border`} size={`sm`}></Spinner>
                    </Then>
                </If>
            </Col>
            <Col xs={1}>
                <If condition={!loading}>
                    <div onClick={fetchItems} className={`btn btn-secondary btn-sm rounded-pill`}>
                        <Icon.ArrowClockwise/>
                    </div>
                </If>
            </Col>

        </Row>
        <Row className={`mt-3`}>
            <Col xs={12}>
            <If condition={!folders.count}>
                <Then>
                    No folders found
                </Then>
                <Else>
                    <Table hover size={`sm`}>
                        <thead>
                        <tr>
                            <th scope="col">NAME</th>
                            <th scope="col">PREFIX</th>
                            <th scope="col">CREATED</th>
                            <th scope="col">DESCRIPTION</th>
                            <th scope="col">S3 PATH</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                folders.nodes.map((f)=>{
                                    return <DatasetFolderListITem dataset={props.dataset} folder={f}/>
                                })
                            }
                        </tbody>
                    </Table>

                </Else>
            </If>
            </Col>
        </Row>
    </Container>


}


export default DatasetFolderList;
