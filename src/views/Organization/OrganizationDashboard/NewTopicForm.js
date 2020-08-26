import useClient from "../../../api/client";
import {Link, useHistory,useParams} from "react-router-dom";
import {useState} from "react";
import createTopic from "../../../api/Organization/addOrUpdateOrganizationTopic";
import {toast} from "react-toastify";
import React from "react";
import {Col, Row} from "react-bootstrap";
import styled from "styled-components";

const FormStyled=styled.div`
border-left:4px solid lightblue;
padding-left: 2em;
height: 12rem;
`

const NewTopicForm = (props)=>{

    let client = useClient();
    let params= useParams();
    let history = useHistory();
    let [formData, setFormData] = useState({label : '', description : ''})

    let handleInputChange=(e)=>{
        setFormData({...formData, [e.target.name] : e.target.value})
    }

    let saveTopic=async ()=>{
        const response = await client.mutate(
            createTopic({
                organizationUri:params.uri,
                input:formData
            })
        )
        if (!response.errors){
            toast(`Saved topic ${formData.label}`);
            history.goBack();
        }else {
            toast(`Could not saved ne topic, received ${response.errors[0].message}`);
        }
    }

    return <React.Fragment>
        <Row>
            <Col xs={12}>
                <h5>Create new Topic</h5>
            </Col>
        </Row>
        <FormStyled>
            <Row>
                <Col xs={10}>
                    Topic
                </Col>
                <Col xs={6}>
                    <input
                        name={`label`}
                        value={formData.label}
                        onChange={handleInputChange}
                        style={{width:'100%'}} className={`form-control`}></input>
                </Col>
            </Row>
            <Row>
                <Col xs={10}>
                    Description
                </Col>
                <Col xs={6}>
                    <input
                        name={`description`}
                        value={formData.description}
                        onChange={handleInputChange}
                        style={{width:'100%'}} className={`form-control`}>

                    </input>
                </Col>
            </Row>
            <Row className={`mt-3`}>
                <Col xs={4}>
                    <div className={`btn-group`}>
                        <div onClick={saveTopic} className={`btn btn-sm btn-primary`}>
                            Save
                        </div>

                        <Link to={`/organization/${props.organization.organizationUri}/dashboard/topics`}>
                            <div  className={`btn btn-sm btn-secondary`}>
                                Cancel
                            </div>
                        </Link>

                    </div>
                </Col>
            </Row>
        </FormStyled>
    </React.Fragment>

}


export default NewTopicForm
