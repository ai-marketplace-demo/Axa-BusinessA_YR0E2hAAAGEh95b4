import React, {useState, useEffect} from "react";
import {Container, Row, Col, Base, Spinner} from "react-bootstrap";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select'
import {Link,useParams,useLocation,useHistory} from "react-router-dom";
import { toast } from 'react-toastify';
import Steps from "../../components/Steps/Steps";
import useClient from "../../api/client";
import createProject from "../../api/Project/createProject";
import listOrganizationEnvironments from "../../api/Environment/listOrganizationEnvironments";
import listOrganizations from "../../api/Organization/listOrganizations";
import listProjects from "../../api/Project/listProjects";
import getDataset from "../../api/Dataset/getDataset";
import createRequest from "../../api/DataAccessRequest/createRequest";


const Background=styled.div`
height: 20rem;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
border-left:  4px solid lightgreen;

box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`

const NewDataRequestAccess= (_props)=>{
    let params=useParams();
    let datasetUri = params.uri;
    const client  = useClient();
    let [dataset,setDataset] = useState({datasetUri,label:``,organization:{}})
    let [formData, setFormData]=useState({description:''});
    let [org, setOrg] = useState({label:null, value:null,name:null})
    let [orgs,setOrgs] = useState([]);
    let [env, setEnv] = useState({label:'', value:''})
    let [envs,setEnvs] = useState([]);
    //let [projects, setProjects] = useState([])
    //let [project, setProject] = useState({label:null,value:null,name:null})

    let [ready, setReady] = useState(true);


    const submitForm = async ()=>{
        //const principalId = project.value||org.value;
        const principalId = env.value;
        const principalName = org.name;
        const principalType = 'Environment';

        const response = await client.mutate(
            createRequest({
                datasetUri : dataset.datasetUri,
                input:{
                    description: formData.description,
                    label:principalName,
                    principalId ,
                    principalType
                }
            })
        )
        if (!response.errors){
            toast(`Submitted data access request to Dataset owners`)
        }else {
            toast.warn(`Could not submit request, received ${response.errors[0].message}`)
        }
    }

    const selectOrg=async (selectOption)=>{
        setOrg(selectOption);
        const response = await client.query(listOrganizationEnvironments({
            organizationUri:selectOption.value
        }))
        if (!response.data.errors){
            setEnvs(response.data.getOrganization.environments.nodes.map((environment)=>{
                return {
                    value:environment.environmentUri,
                    label : `${environment.name}/${environment.AwsAccountId}/${environment.region}`
                }
            }))
        }else {
            toast(`Could not retrieve environments in organization ${org.label}`)
        }
    }


    const selectEnv=(selectOption)=>{
        setEnv(selectOption)
    }

    const handleChange =(e)=>{
        setFormData({...formData, [e.target.name]:e.target.value})
    }


    const fetchOrganizations = async ()=>{
        const org_response = await client.query(listOrganizations({filter:{roles:['Admin','Member','Owner']}}));
        if (!org_response .errors){
            setOrgs(org_response .data.listOrganizations.nodes.map((org)=>{
                return {
                    name : org.name,
                    label : org.label+` (${org.organizationUri})`,
                    value:org.organizationUri}
            }));
            if (!dataset.label){
                const dataset_res = await client.query(getDataset(datasetUri));
                setDataset(dataset_res.data.getDataset);
            }
            setReady(true);
        }
    }
    useEffect(()=>{
        if (client){
            fetchOrganizations();
        }
    },[client]);

    if (!ready){
        return <Spinner animation={`border`} variant={`primary`}/>
    }
    return <Container>
        <Row>
            <Col xs={12}>
                <h4> <Icon.EnvelopeOpen xs={48}/> Request Dataset Access For Dataset :<Link to={`/dataset/${datasetUri}/overview`}>
                    {dataset.label}
                </Link></h4>
            </Col>
        </Row>
        <Background >

            <Row>
                <Col xs={2}><b>On behalf of Organization</b></Col>
                <Col xs={4}>
                    <Select value={org} onChange={selectOrg} options={orgs}/>
                </Col>
                <Col xs={2}><b>Environment</b></Col>
                <Col xs={4}>
                    <Select value={env} onChange={selectEnv} options={envs}/>
                </Col>
            </Row>

            <Row className={"mt-1"}>
                <Col xs={2}><b>Message</b></Col>
                <Col xs={10}>
                    <textarea
                        className={`form-control`}
                        rows={5}
                        name={"description"}
                        value={formData.description}
                        onChange={handleChange}
                        style={{resize:'None',width:'100%'}}

                        placeholder={"Why do you need access to this dataset ?"}>

                    </textarea>
                </Col>
            </Row>
            <Row className={"mt-2"}>
                <Col xs={2}><b></b></Col>
                <Col xs={10}>
                    <div onClick={submitForm} className={"btn btn-sm btn-primary"}>Request</div>
                </Col>
            </Row>


        </Background>


    </Container>


}

export default NewDataRequestAccess;
