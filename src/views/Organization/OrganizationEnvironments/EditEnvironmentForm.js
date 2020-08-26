import React ,{useState,useEffect} from "react";
import {Container, Table,Row, Badge,Col,Spinner} from "react-bootstrap";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select'
import {Link,useParams,useLocation} from "react-router-dom"


const FormStyled=styled.div`
border: 1px lightgrey solid;
height:20em;
border-radius: 0px Opx 5px 5px;
border-left: 7px solid lightblue;
padding: 3em;
width:80%;
box-shadow: 0px 8px 3px  lightgrey;
`

const EditEnvironmentForm= (props)=>{
    let params=useParams();
    let location = useLocation();
    let group = {};

    let [ready, setReady] = useState(true);
    let[environment, setEnvironment] = useState(location.state.environment);


    const onSubmit=()=>{
        console.log(environment)
    }
    const handleInputChange = (e) => setEnvironment({
        ...group,
        [e.currentTarget.name]: e.currentTarget.value
    })
    return <Container>
        <Row>
            <Col xs={1}>
                <Link
                    style={{color:"black"}}
                    to={{
                        state:location.state.organization,
                        pathname:`/organization/${params.uri}/environments`
                    }}><Icon.ChevronLeft size={36}/></Link>
            </Col>
            <Col xs={11}>
                <h3>Edit Environment <b className={"text-secondary"}>{location.state.environment.label}</b> (in Organization <b className={"text-primary"}>{location.state.organization.label}</b>)</h3>
            </Col>
        </Row>
        {
            (!ready)?(
                <Spinner variant={"primary"} animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            ):(
                <FormStyled className={"mt-5"}>

                    <Row >
                        <Col className="" xs={3}><b>ID</b></Col>
                        <Col xs={5}>
                            <code>{environment.environmentUri}</code>
                        </Col>
                    </Row>
                    <Row >
                        <Col className="" xs={3}><b>AWS</b></Col>
                        <Col xs={5}>
                            <code>{environment.AWSAccountId}</code>
                        </Col>
                    </Row>
                    <Row >
                        <Col className="" xs={3}><b>Name</b></Col>
                        <Col xs={5}>
                            <code>{environment.name}</code>
                        </Col>
                    </Row>
                    <Row >
                        <Col className="pt-2" xs={3}><h6><b>Label</b></h6></Col>
                        <Col xs={5}>
                            <input
                                className={`form-data`}
                                name={'label'}
                                onChange={handleInputChange}
                                value={environment.label} style={{width:'100%'}}/>
                        </Col>

                    </Row>
                    <Row >
                        <Col className="pt-2" xs={3}><h6><b>Description</b></h6></Col>
                        <Col xs={5}>
                            <input
                                className={`form-data`}
                                name={"description"}
                                onChange={handleInputChange}
                                value ={environment.description}
                                style={{width:'100%'}}/>
                        </Col>

                    </Row>

                    <Row className={"mt-3"}>
                        <Col xs={3}/>
                        <Col xs={2}>
                            <div className={"btn-group"}>
                                <div onClick={onSubmit} className={"btn btn-success"}>
                                    Save
                                </div>
                                <div className={"btn btn-secondary"}>
                                    <Link
                                        className="text-white"
                                        to={{
                                            state:location.state.organization,
                                            pathname:`/organization/${location.state.organization.organizationUri}/environments`}}> Cancel</Link>
                                </div>

                            </div>
                        </Col>
                    </Row>
                </FormStyled>
            )
        }

    </Container>
}


export default EditEnvironmentForm;
