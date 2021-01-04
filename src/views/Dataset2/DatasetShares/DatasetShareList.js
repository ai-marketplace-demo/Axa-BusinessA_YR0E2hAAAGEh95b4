import React, {useState, useEffect} from "react";
import {Container, Row, Col, Table, Spinner, Badge} from "react-bootstrap";
import {If, Then , Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import listDatasetShareObjects from "../../../api/ShareObject/listDatasetShareObjects";
import DatasetShareListItem from "./DatasetShareListItem";
import DatasetShareObjectForm from "./NewShareObject";
import useClient from "../../../api/client";
import {toast} from "react-toastify";



const DatasetShareList = (props)=>{
    const client = useClient();
    const [loading, setLoading] = useState(false);
    const [mode,setMode] = useState("list");
    const [shares, setShares] = useState({
        count:0,
        page:1,
        pages:1,
        hasNext: false,
        hasPrevious:false,
        nodes:[]
    });


    const fetchItems =async ()=>{
        setLoading(true);
        const response= await client.query(listDatasetShareObjects ({datasetUri:props.dataset.datasetUri}));
        if (!response.errors){
            setShares({...response.data.getDataset.shares});
        }else{
            toast(`Could not retrieve shares, received ${response.errors[0].message}`);
        }
        setLoading(false);
    }


    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client])

    if (mode=="form"){
        return <Container className={`mt-2`} fluid>
            <Row>
                <Col xs={12}>
                    <DatasetShareObjectForm dataset={props.dataset} close={()=>{setMode("")}}/>
                </Col>
            </Row>
            </Container>
    }
    return <Container fluid>
        <Row>
            <Col xs={2}>
                <div onClick={()=>{setMode("form")}} className={`btn btn-sm btn-info rounded-pill`}>
                    Create Share
                </div>
            </Col>
            <Col xs={8}></Col>
            <Col xs={1}>
                <If condition={loading}>
                    <Then>
                        <Spinner variant={`info`} animation={`border`} size={`sm`}></Spinner>
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
                <If condition={!shares.count}>
                    <Then>
                        No shares found
                    </Then>
                    <Else>
                        <Table borderless  hover size={`sm`}>
                            <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">ORG</th>
                                <th scope="col">GROUP</th>
                                <th scope="col">AWS</th>
                                <th scope="col">REGION</th>
                                <th scope="col">CREATED</th>
                                <th scope="col">STATUS</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                shares.nodes.map((share)=>{
                                    return <DatasetShareListItem dataset={props.dataset} share={share}/>
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


export default DatasetShareList;
