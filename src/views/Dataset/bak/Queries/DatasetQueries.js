import React ,{useState} from "react";
import {Row,Col,Container, Button,Spinner} from "react-bootstrap";
import * as Icon  from "react-bootstrap-icons";
import styled from "styled-components";
import {Link } from "react-router-dom";

const Background=styled.div`
__height: 25vh;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`



const DatasetQuery= (props)=>{
    return <Row className={"mt-2"}>
        <Col className="" xs={1}>
            <Icon.FileCode size={22}/>
        </Col>
        <Col xs={4}>
            <Link to={`/query/${props.queryName}`}><b>{props.queryName}</b></Link>
        </Col>
        <Col xs={3}>
            {props.description}
        </Col>
        <Col xs={2}>
            <Button size={"sm"} variant={'primary'}>Edit</Button>
        </Col>
        <Col xs={2}>
            <Button size={"sm"} variant={'warning'}>Delete</Button>
        </Col>
    </Row>
}
const DatasetQueryList=(props)=>{

    let [queries, setQueries] = useState([]);
    setTimeout(()=>{
        setQueries([
            {queryName:"salesaggregate", description:"a query showing sales overtime"},
            {queryName:"customersgrowth", description:"nb of customers over time and country"},
        ])
    },600)

    return <Background><Container className={"ml-1 p-0"}>
        {(!queries.length)?(
            <Spinner variant={"primary"} animation={"border"}/>
        ):(
            <Row>
                <Col xs={11}>
                    {
                        queries.map((query)=>{
                            return <DatasetQuery {...query}/>
                        })}
                </Col>
            </Row>

        )}

    </Container>
    </Background>
}


export default DatasetQueryList;
