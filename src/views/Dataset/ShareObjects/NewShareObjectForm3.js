import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge,Dropdown} from "react-bootstrap";
import {If, Then, Else} from "react-if";
import Avatar from "react-avatar"
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import {toast} from "react-toastify";
import styled from "styled-components";
import Autosuggest from 'react-autosuggest';
import useClient from "../../../api/client";
import getDataset from "../../../api/Dataset/getDataset";
import addDatasetContributor from "../../../api/Dataset/addDatasetContributor";
import listOrganizations from "../../../api/Organization/listOrganizations";
import listOrganizationEnvironments from "../../../api/Environment/listOrganizationEnvironments";
import searchPrincipal from "../../../api/Principal/searchPrincipal";
import createShareObject from "../../../api/ShareObject/createShareObject";

import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const Styled=styled.div`
height: 60vh;
width:98%;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
border-left:  4px solid lightseagreen;
overflow-y: auto;
box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`


const SearchResult=styled.div`
width:100%;
&:hover{
background-color: whitesmoke;
}
`

const BaseStyle=styled.div`
z-index: 0;`

const NewShareObjectForm= (props)=>{

    let client = useClient();
    let history = useHistory();
    const [term, setTerm] = useState('')
    const [orgs, setOrgs]  = useState([]);
    const [envs, setEnvs]  = useState([]);
    const [org, setOrg]  = useState({});
    const [env, setEnv] = useState({});

    const fetchOrganizations=async ()=>{
        console.log("fetchOrganizations");
        const response = await client.query(listOrganizations({
            filter: {term:'',roles:['Owner','Admin','Member']}
        }));
        if (!response.errors){
            console.log("fetchOrganizations ==>", response);
            setOrgs(response.data.listOrganizations.nodes.map((node)=>{
                return {label : `${node.label} (${node.organizationUri})`, value:node.organizationUri}
            }))

        }else {
            toast(`Could not retrieve organizations, received ${response.errors[0].message}`)
        }
    }

    const updateEnvs=async ()=>{
        console.log("updateEnvs", org)

    }


    const selectOrg = async (opt)=>{
        console.log("selectOrg  ==", opt);
        setOrg(opt);
        const response = await client.query(listOrganizationEnvironments({
            organizationUri:opt.value
        }));
        if (!response.errors){
            console.log("updateEnvs", response)
            setEnvs(response.data.getOrganization.environments.nodes.map((env)=>{
                return {label : `${env.name}(#${env.AwsAccountId}/${env.SamlGroupName})`, value:env.environmentUri}
            }))
        }else {
            toast(`Could not retrieve environments, received ${response.errors[0].message}`)
        }    }

    const selectEnv= (opt)=>{
        setEnv(opt);
    }

    const onSubmit=async ()=>{
        const res= await client.mutate(
            createShareObject({
                datasetUri:props.dataset.datasetUri,
                input:{
                    principalId : env.value,
                    principalType: "Environment",
                    //label : env.label,
                }
            })
        )
        if (!res.errors){
            toast(`Added share object  ${env.label} `,{
                hideProgressBar:true
            })
            history.goBack();

        }else {
            toast.error(`Could not add contributor, received ${res.errors[0].message}`,{
                hideProgressBar:true
            })
        }

    }


    useEffect(()=>{
        if (client){
            fetchOrganizations();
        }
    },[client])


    return <Styled>
        <Container>
            <Row>
                <Col xs={12}>
                    <h3>Create Access Request</h3>
                </Col>
            </Row>
            <Row className={`mt-4`}>
                <Col xs={2}>
                    <b>Organization</b>
                </Col>
                <Col xs={8}>
                    <Select
                        isMulti={false}
                        value={org}
                        isSearchable={true}
                        options={orgs}
                        onChange={selectOrg}/>
                </Col>
            </Row>
            <Row className={`mt-3`}>
                <Col xs={2}>
                    <b>Environment</b>
                </Col>
                <Col xs={8}>
                    <Select
                        isMulti={false}
                        value={env}
                        isSearchable={true}
                        options={envs}
                        onChange={selectEnv}/>
                </Col>
            </Row>
            <Row className={`mt-2`}>
                <Col xs={2}>

                </Col>
                <Col xs={8}>
                    <If condition={org.label && env.label}>
                        <Then>
                            <div onClick={onSubmit} className={`mt-2 btn btn-primary`}>
                                Create
                            </div>
                        </Then>
                    </If>
                </Col>

            </Row>
        </Container>
    </Styled>

}


export default NewShareObjectForm;
