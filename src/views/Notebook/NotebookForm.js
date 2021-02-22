import React, {useState, useEffect} from "react";
import {Container, Row, Col, Badge, Spinner, Table} from "react-bootstrap";
import {If, Then, Else} from "react-if";
import {Link} from "react-router-dom";
import listOrganizationEnvironments from "../../api/Environment/listOrganizationEnvironments";
import listOrganizations from "../../api/Organization/listOrganizations";
import {AwsRegionsSelect, getRegionLabel}  from "../../components/AwsRegions/AwsRegionSelect";
import useClient from "../../api/client";
import * as SiIcon from "react-icons/si";
import Select from 'react-select';
import styled from "styled-components";
import createSagemakerNotebook from "../../api/SagemakerNotebook/createSagemakerNotebook";
import {toast} from "react-toastify";

const Background=styled.div`
margin-top: 7%;
margin-right: 5px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
border-left:  4px solid #24a8c9;
padding: 16px;
`

const NotebookForm = (props)=>{
    const client= useClient();
    const [formData, setFormData] = useState({
        environmentUri : null,
        label : "NotebookName",
        description: "Sagemaker Notebook Instance "
    })
    const [saving, setSaving] = useState(false);
    let [org, setOrg] = useState({label:null, value:null})
    let [orgs,setOrgs] = useState([])
    let [env, setEnv] = useState({label:null, value:null,region:{value:'',label:''}})
    let [envs, setEnvs] = useState([]);


    const fetchOrgs= async()=>{
        const response= await client
            .query(listOrganizations({filter:{roles:['Admin','Member','Owner']}}))
        if (!response.errors){
            setOrgs(response.data.listOrganizations.nodes.map((org)=>{
                return {label : org.label+` (${org.organizationUri})`,value:org.organizationUri}
            }));
        }
    }
    const selectOrg=async (selectOption)=>{
        setOrg(selectOption);
        const res = await client.query(listOrganizationEnvironments({
            organizationUri:selectOption.value,
            filter:{
                page:1,
                roles:["Admin","Owner","Invited"],
                pageSize:10
            }
        }));
        if (!res.errors){
            setEnvs(res.data.getOrganization.environments.nodes.map((e)=>{
                return {
                    label : `${e.label}(${e.SamlGroupName})`,
                    value:e.environmentUri,
                    region:{
                        label:getRegionLabel(e.region),value:e.region}
                }
            }))

        }
    }

    const selectEnv= (selectOption)=>{
        setEnv(selectOption);
    }

    const submitForm = async ()=>{
        setSaving(true);
        const response = await client
            .mutate(
                createSagemakerNotebook({...formData, environmentUri:env.value})
            )
        if (!response.errors){
            toast(`Created notebook`)
        }else {
            toast(`Could not create notebook, received ${response.errors[0].message}`);
        }
        setSaving(false);
    }
    useEffect(()=>{
        if (client){
            fetchOrgs();
        }
    },[client]);


    return<Container>
        <Row className={`mt-2`}>
            <Col xs={12}>
                <h3><SiIcon.SiJupyter/> Create Notebook <b className={`ml-2 text-primary`}>{formData.label}</b></h3>
            </Col>
        </Row>
    <Background>
        <If condition={!saving}>
            <Then>
                <Container>
                    <Row>
                        <Col xs={1}><b>Org</b></Col>
                        <Col xs={3}>
                            <Select value={org} onChange={selectOrg} options={orgs}/>
                        </Col>
                        <Col xs={1}><b>Env</b></Col>
                        <Col xs={3}>
                            <Select value={env} onChange={selectEnv} options={envs}/>
                        </Col>
                        <Col xs={1}><b>Region</b></Col>
                        <Col xs={3}>
                            <Select isDisabled={true} value={env?env.region:''}/>
                        </Col>
                    </Row>
                    <Row className={"mt-2"}>
                        <Col xs={1}><b>Label</b></Col>
                        <Col xs={11}>
                            <input
                                className={`form-control`}
                                name={"label"}
                                value={formData.label}
                                onChange={(e)=>{setFormData({label:e.target.value})}}
                                style={{width:'100%'}} placeholder={"Notebook name"}/>
                        </Col>
                        <Col className={`mt-3`} xs={1}><b>Description</b></Col>
                        <Col className={`mt-3`}  xs={11}>
                            <input
                                className={`form-control`}
                                name={"label"}
                                value={formData.description}
                                onChange={(e)=>{setFormData({description:e.target.value})}}
                                style={{width:'100%'}} placeholder={"Notebook description"}/>
                        </Col>

                    </Row>
                    <Row className={"mt-4"}>
                        <Col xs={1}><b></b></Col>
                        <Col xs={2}>
                            <div onClick={submitForm} className={"btn btn-sm btn-info"}>Create</div>
                        </Col>
                        <Col xs={2}>
                            <Link to={"/notebooks"}>
                                <div className="btn btn-sm btn-outline-primary" type="submit">
                                    <b>Cancel</b>
                                </div>
                            </Link>

                        </Col>
                    </Row>
                </Container>

            </Then>
            <Else>
                <Row>
                    <Col xs={12}>
                        <Spinner variant={`primary`} animation={`border`}/>
                    </Col>
                </Row>
            </Else>
        </If>

    </Background>
    </Container>
}


export default NotebookForm ;
