import React ,{useState,useEffect} from "react";
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
width:80%;
box-shadow: 0px 8px 3px  lightgrey;
`

const EditGroupForm= (props)=>{
    let params=useParams();
    let location = useLocation();

    let [ready, setReady] = useState(true);
    let[group, setGroup] = useState(location.state.group);


    const onSubmit=()=>{
        console.log(group)
    }
    const handleInputChange = (e) => setGroup({
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
                        pathname:`/organization/${params.uri}/groups`
                    }}><Icon.ChevronLeft size={36}/></Link>
            </Col>
            <Col xs={11}>
                <h3>Edit Group <b className={"text-secondary"}>{location.state.group.label}</b> (in Organization <b className={"text-primary"}>{location.state.organization.label}</b>)</h3>
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
                            <code>{group.groupUri}</code>
                        </Col>
                    </Row>
                    <Row >
                        <Col className="" xs={3}><b>Name</b></Col>
                        <Col xs={5}>
                            <code>{group.name}</code>
                        </Col>
                    </Row>
                    <Row >
                        <Col className="pt-2" xs={3}><h6><b>Label</b></h6></Col>
                        <Col xs={5}>
                            <input name={'label'} onChange={handleInputChange} value={group.label} style={{width:'100%'}}/>
                        </Col>

                    </Row>
                    <Row >
                        <Col className="pt-2" xs={3}><h6><b>Description</b></h6></Col>
                        <Col xs={5}>
                            <input name={"description"} onChange={handleInputChange} value ={group.description} style={{width:'100%'}}/>
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
                                            pathname:`/organization/${location.state.organization.organizationUri}/groups`}}> Cancel</Link>
                                </div>

                            </div>
                        </Col>
                    </Row>
                </FormStyled>
            )
        }

    </Container>
}


export default EditGroupForm;
