import React, {useState, useEffect} from "react";
import {Container, Row, Col, Badge, Spinner, Table} from "react-bootstrap";
import {If, Then, Else} from "react-if";
import {Link} from "react-router-dom";
import listOrganizationEnvironments from "../../api/Environment/listOrganizationEnvironments";
import listOrganizations from "../../api/Organization/listOrganizations";
import {AwsRegionsSelect, getRegionLabel}  from "../../components/AwsRegions/AwsRegionSelect";
import useClient from "../../api/client";
import useGroups from "../../api/useGroups";
import SelectGroup from "../../components/SelectGroup/SelectGroup";
import Select from 'react-select';
import styled from "styled-components";
import createScheduledQuery from "../../api/SavedQuery/createScheduledQuery";
import {toast} from "react-toastify";

const Background=styled.div`
margin-top: 7%;
margin-right: 5px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
border-left:  4px solid lightseagreen;
padding: 16px;
`

const QueryForm = (props)=>{
    const client= useClient();
    const [formData, setFormData] = useState({
        environmentUri : null,
        label : "RefreshData",
        description: "Scheduled Query"
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
                createScheduledQuery({...formData, environmentUri:env.value})
            )
        if (!response.errors){
            toast(`Created scheduled query`)
        }else {
            toast(`Could not create scheduled query, received ${response.errors[0].message}`);
        }
        setSaving(false);
    }
    useEffect(()=>{
        if (client){
            fetchOrgs();
        }
    },[client]);


    return <Background>
        <If condition={!saving}>
            <Then>
                <Container className={`mt-3`}>
                    <Row className={`mt-2`}>
                        <Col xs={12}>
                            <h3>Create Scheduled Query  <b className={`text-primary`}>{formData.label}</b></h3>
                        </Col>
                    </Row>
                    <Row className={`mt-2`}>
                        <Col xs={12}>
                            <h4>Settings</h4>
                        </Col>
                    </Row>

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
                    <Row className={`mt-4`}>
                        <Col xs={1}/>
                        <Col xs={2}>
                            <div onClick={submitForm} className={`btn btn-primary rounded-pill`}>
                                Save
                            </div>
                        </Col>
                        <Col xs={2}>
                            <Link to={`/queries`}>
                                <div className={`btn btn-secondary rounded-pill`}>
                                    Cancel
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
}


export default QueryForm ;
