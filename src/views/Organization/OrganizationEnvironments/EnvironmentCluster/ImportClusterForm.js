import React ,{useState} from "react";
import {Container, Table,Row, Badge,Col,Spinner} from "react-bootstrap";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select'
import {Link,useParams,useLocation} from "react-router-dom"


const FormStyled=styled.div`
border: 1px lightgrey solid;
height:15em;
border-radius: 0px Opx 5px 5px;
border-left: 7px solid lightblue;
padding: 3em;
width:70%;
box-shadow: 0px 1px 0px 1px lightyellow;
`

const ImportClusterForm= (props)=>{
    let params=useParams();
    let location = useLocation();
    let [ready, setReady] = useState(false);

    const options = [
        { value: 'Data', label: 'Data' },
        { value: 'Compute', label: 'Compute' }
    ]

    return <Container>
        <Row>
            <Col xs={1}>
                <Link
                    style={{color:"black"}}
                    to={{
                        state : location.state,
                        pathname:`/environment/${params.uri}/clusters`}}
                ><Icon.ChevronLeft size={36}/></Link>
            </Col>
            <Col xs={11}>
                <h3>Link Redshift Cluster to Environment <b className={"text-primary"}>{location.state.environment.label}</b></h3>
            </Col>
        </Row>
        <FormStyled className={"mt-5"}>
            <Row >
                <Col className="pt-2" xs={1}><h6><b>Name</b></h6></Col>
                <Col xs={4}>
                    <input placeholder={"enter environment name"} style={{width:'100%'}}/>
                </Col>
            </Row>
            <Row >
                <Col className="pt-2" xs={1}><h6><b>AWS</b></h6></Col>
                <Col xs={4}>
                    <input placeholder={"Account Id"} style={{width:'100%'}}/>
                </Col>
            </Row>
            <Row className={"mt-2"}>
                <Col className="pt-2" xs={1}><h6><b>Type</b></h6></Col>
                <Col xs={4}>
                    <Select options={options}/>
                </Col>
            </Row>
            <Row className={"mt-3"}>
                <Col xs={1}/>
                <Col xs={2}>
                    <div className={"btn border bg-white"}>
                        Link
                    </div>
                </Col>
            </Row>
        </FormStyled>
    </Container>
}


export default ImportClusterForm;
