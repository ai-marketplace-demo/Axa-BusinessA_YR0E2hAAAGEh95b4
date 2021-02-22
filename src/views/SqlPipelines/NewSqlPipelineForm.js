import React, {useState, useEffect} from "react";
import {Container, Row, Col, Base, Spinner} from "react-bootstrap";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select'
import ReactTagInput from "@pathofdev/react-tag-input";
import {Link,useParams,useLocation,useHistory} from "react-router-dom";
import { toast } from 'react-toastify';
import Steps from "../../components/Steps/Steps";
import useClient from "../../api/client";
import createSqlPipeline from "../../api/SqlPipeline/createSqlPipeline";
import listOrganizationEnvironments from "../../api/Environment/listOrganizationEnvironments";
import listOrganizations from "../../api/Organization/listOrganizations";
import {AwsRegionsSelect, getRegionLabel}  from "../../components/AwsRegions/AwsRegionSelect";

const Background=styled.div`
#height: 23rem;
margin-top: 6px;
border-radius: 0px;
overflow-y: auto;
background-color: white;
border : 1px solid lightgrey;
border-left:  4px solid #24a8c9;

box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`


const Topics=Object.keys({
    Finances: "Finances",
    HumanResources: "HumanResources",
    Products: "Products",
    Services: "Services",
    Operations: "Operations",
    Research: "Research",
    Sales: "Sales",
    Orders: "Orders",
    Sites: "Sites",
    Energy: 'Energy',
    Customers: "Customers",
    Misc: "Misc"
}).map((k)=>{
    return {label : k, value:k}
})

const NewSqlPipelineForm= (_props)=>{
    let location=useLocation();
    let history = useHistory();
    const client  = useClient();


    let [formData, setFormData]=useState({
        label:'SqlPipeline name',
        env: {},
        org:{},
        SamlGroupName: '',
        description:'sqlPipeline description',
        topics:[],
        tags:[]});

    let [orgs,setOrgs] = useState([])
    let [envs, setEnvs] = useState([]);

    let [ready, setReady] = useState(true);
    let [isSubmitting, setIsSubmitting] = useState(false);

    const selectOrg=async (selectOption)=>{
        setFormData({...formData, org:selectOption});
        const res = await client.query(listOrganizationEnvironments({organizationUri:selectOption.value}));
        if (!res.errors){
            setEnvs(res.data.getOrganization.environments.nodes.map((e)=>{
                return {label : e.label, value:e.environmentUri, region:{label:getRegionLabel(e.region),value:e.region}}
            }))
        }
    }

    const selectTopic=(selectOption)=>{
        setFormData({...formData, topics:selectOption});
    }


    const selectEnv= (selectOption)=>{
        setFormData({...formData, env: selectOption});
    }

    const handleChange =(e)=>{
        setFormData({...formData, [e.target.name]:e.target.value})
    }

    useEffect(()=>{
        if (client){
            client
                .query(listOrganizations({filter:{roles:['Admin','Member','Owner']}}))
                .then((res)=>{
                    setOrgs(res.data.listOrganizations.nodes.map((org)=>{
                        return {label : org.label+` (${org.organizationUri})`,value:org.organizationUri}
                    }));
                })
        }
    },[client]);

    const submitForm=async ()=>{
        setIsSubmitting(true);
        const res = await client.mutate(
            createSqlPipeline({
                input:{
                    label :formData.label,
                    environmentUri:formData.env.value,
                    //region : formData.region.value,
                    tags:formData.tags,
                    SamlGroupName:formData.SamlGroupName,
                    //topics : formData.topics?formData.topics.map((t)=>{return t.value}):[],
                    description:formData.description,
                }
            })
        )
        setIsSubmitting(false);
        if (!res.errors){
            toast(`Created SqlPipeline  ${formData.label} in ${formData.org.label}/${formData.env.label}`,{
                hideProgressBar:true,
                onClose:()=>{history.goBack()}
            })
        }else {
            toast.error(`An error was returned ${res.errors[0].message}`)
        }

    }

    return <Container>
        <Row>
            <Col xs={4}>
                <h4> <Icon.Gear/> Create New Pipeline</h4>
            </Col>
            <Col xs={8}>
                {(isSubmitting)?(
                    <Row>
                        <Col xs={2}>
                            <Spinner animation={`border`} variant={`primary`}/>
                        </Col>
                        <Col xs={8}>
                            <p>Creating your sqlPipeline, it should take a few seconds</p>
                        </Col>
                    </Row>
                ):(
                    <div/>)}

            </Col>
        </Row>
        {
            (!isSubmitting)?(
                <Container>
                    <Background >

                        <Row>
                            <Col xs={2}><b>Settings</b></Col>
                            <Col xs={10}>
                                <Row>

                                    <Col xs={1}><b>Org</b></Col>
                                    <Col xs={3}>
                                        <Select value={formData.org} onChange={selectOrg} options={orgs}/>
                                    </Col>
                                    <Col xs={1}><b>Env</b></Col>
                                    <Col xs={3}>
                                        <Select value={formData.env} onChange={selectEnv} options={envs}/>
                                    </Col>
                                    <Col xs={1}><b>Region</b></Col>
                                    <Col xs={3}>
                                        <Select isDisabled={true} value={formData.env?formData.env.region:''}/>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className={"mt-1"}>
                            <Col xs={2}><b>Admin Group</b></Col>
                            <Col xs={10}>
                                <input
                                    className={`form-control`} name={"SamlGroupName"}  value={formData.SamlGroupName} onChange={handleChange} style={{width:'100%'}} placeholder={"SqlPipeline Members Group"}></input>
                            </Col>
                        </Row>
                        <Row className={"mt-1"}>
                            <Col xs={2}><b>Name</b></Col>
                            <Col xs={10}>
                                <input className={`form-control`} name={"label"}  value={formData.label} onChange={handleChange} style={{width:'100%'}} placeholder={"name your dataset"}></input>
                            </Col>
                        </Row>
                        <Row className={"mt-2"}>
                            <Col xs={2}><b>Description</b></Col>
                            <Col xs={10}>
                    <textarea
                        value={formData.description}
                        onChange={handleChange}
                        className={"form-control"}
                        row={3}
                        style={{resize:'None',width:'100%'}} name={"description"} placeholder={"name your dataset"}></textarea>
                            </Col>
                        </Row>


                        <Row className={`mt-2`}>
                            <Col xs={2}><b>Topics</b></Col>
                            <Col xs={10}>
                                <Select
                                    value={formData.topics}
                                    isMulti
                                    onChange={selectTopic}
                                    options={Topics}
                                />

                            </Col>

                        </Row>

                        <Row className={"mt-2"}>
                            <Col xs={2}><b>Tags</b></Col>
                            <Col xs={10}>
                                <ReactTagInput
                                    className={`form-control`}
                                    tags={formData.tags}
                                    onChange={(newTags) => setFormData({...formData, tags:newTags})}
                                />

                            </Col>
                        </Row>

                        <Row className={"mt-4"}>
                            <Col xs={2}><b></b></Col>
                            <Col xs={2}>
                                <div onClick={submitForm} className={"btn btn-sm btn-info"}>Create</div>
                            </Col>
                            <Col xs={2}>
                                <Link to={"/sqlpipelines"}>
                                    <div className="btn btn-sm btn-outline-primary" type="submit">
                                        <b>Cancel</b>
                                    </div>
                                </Link>

                            </Col>
                        </Row>


                    </Background>
                    <Row>
                        <div style={{height:'200px'}}></div>
                    </Row>
                </Container>

            ):(
                <div/>)
        }


    </Container>


}

export default NewSqlPipelineForm;
