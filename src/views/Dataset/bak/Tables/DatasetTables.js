import React ,{useState} from "react";
import {Row,Col,Container, Button,Spinner} from "react-bootstrap";
import * as Icon  from "react-bootstrap-icons";
import styled from "styled-components";
import {Link} from "react-router-dom";

const Background=styled.div`
__height: 25vh;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`



const DatasetTable = (props)=>{
    return <Row className={"mt-2"}>
        <Col className="" xs={1}>
            <Icon.Table size={22}/>
        </Col>
        <Col xs={4}>
            <Link to={`/table/${props.tablename}`}><b>{props.tablename}</b></Link>
        </Col>
        <Col xs={3}>
            {props.description}
        </Col>
        <Col xs={2}>
            <Button size={"sm"} variant={'primary'}>Manage</Button>
        </Col>
        <Col xs={2}>
            <Button size={"sm"} variant={'warning'}>Delete</Button>
        </Col>
    </Row>
}
const DatasetTableList=(props)=>{

    let [contributors, setContributors] = useState([]);
    setTimeout(()=>{
        setContributors([
            {tablename:"sales", description:"a table about sales"},
            {tablename:"customers", description:"a table about customers"},
            {tablename:"products", description:"a table about products"}
        ])
    },600)

    return <Background><Container className={"ml-1 p-0"}>
        {(!contributors.length)?(
            <Spinner variant={"primary"} animation={"border"}/>
        ):(
            <Row>
                <Col xs={11}>
                    {
                        contributors.map((contributor)=>{
                            return <DatasetTable {...contributor}/>
                        })}
                </Col>
            </Row>

        )}

    </Container>
    </Background>
}


export default DatasetTableList;
