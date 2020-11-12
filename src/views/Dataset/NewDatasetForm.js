import React, {useState, useEffect} from "react";
import {Container, Row, Col, Base, Spinner} from "react-bootstrap";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select';
import Creatable, { makeCreatableSelect } from 'react-select/creatable';
import {Link,useParams,useLocation,useHistory} from "react-router-dom";
import { toast } from 'react-toastify';
import  {If, Then, Else} from "react-if";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import Steps from "../../components/Steps/Steps";
import useClient from "../../api/client";
import useGroups from "../../api/useGroups";
import SelectGroup from "../../components/SelectGroup/SelectGroup";
import createDataset from "../../api/Dataset/createDataset";
import listOrganizationEnvironments from "../../api/Environment/listOrganizationEnvironments";
import listOrganizations from "../../api/Organization/listOrganizations";
import {AwsRegionsSelect, getRegionLabel}  from "../../components/AwsRegions/AwsRegionSelect";
import TopicSelect from "../../components/Topic/TopicSelect";


const Background=styled.div`
margin-top: -0px;
margin-right: 5px;
z-index: 10;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
border-left:  4px solid lightseagreen;
overflow-y:auto;
overflow-x: hidden;

box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`

const Languages=[
    {label :'German', value:'German'},
    {label :'English', value:'English'},
    {label :'French', value:'French'},
];

const Classificiations = [
    {label :'C1',value:'C1'},
    {label :'C2',value:'C2'},
    {label :'C3',value:'C3'},
]


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

const NewDatasetForm = (_props)=>{
    let location=useLocation();
    let history = useHistory();
    let [submitting, setSubmitting] = useState(false);
    let [dataset, setDataset] = useState({
        General:{},
        Environment:{},
        Details:{}
    });
    const client  = useClient();
    const groups = useGroups();



    let [formData, setFormData]=useState({
        label:'Dataset name',
        region :{},
        description:'dataset description',
        topics:[],
        SamlAdminGroupName: {label:'',value:''},
        language:Languages[0],
        owner:'',
        stewards:[],
        confidentiality: Classificiations[0],
        tags:[]});

    let [org, setOrg] = useState({label:null, value:null})
    let [orgs,setOrgs] = useState([])
    let [env, setEnv] = useState({label:null, value:null,region:{value:'',label:''}})
    let [envs, setEnvs] = useState([]);
    let [tags,setTags] = useState([]);

    const selectOrg=async (selectOption)=>{
        setOrg(selectOption);
        const res = await client.query(listOrganizationEnvironments({
            organizationUri:selectOption.value,
            filter:{
                page:1,
                roles:["Admin","Owner","Invited","DatasetCreator"],
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

    const selectStewards=(selectOption)=>{
        setFormData({...formData, stewards:selectOption});
    }

    const selectEnv= (selectOption)=>{
        setEnv(selectOption);
    }

    const selectLanguage=(selectOption)=>{
        setFormData({...formData, language:selectOption})
    }

    const selectConfidentiality=(selectOption)=>{
        setFormData({...formData, confidentiality: selectOption})
    }

    const selectTopic=(selectOption)=>{
        setFormData({...formData, topics:selectOption});
    }

    const selectRegion=(selectOption)=>{
        setFormData({...formData, region:selectOption})
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
    },[client,submitting]);

    const submitForm=async ()=>{
        setSubmitting(true);
        console.log(formData)
        console.log(env)
        console.log(org);
        const res = await client.mutate(
            createDataset({
                label :formData.label,
                language : formData.language.value,
                confidentiality:formData.confidentiality.value,
                topics : formData.topics?formData.topics.map((t)=>{return t.value}):[],
                tags:tags,
                //region : env.region,//formData.region.value,
                owner:formData.owner,
                SamlAdminGroupName: formData.SamlAdminGroupName.value,
                businessOwnerEmail : formData.owner,
                businessOwnerDelegationEmails : formData.stewards ?formData.stewards.map((s)=>{return s.value}):[],
                description:formData.description,
                environmentUri : env.value,
                organizationUri : org.value
            })
        )
        setSubmitting(false);
        if (!res.errors){
            toast(`Created Dataset ${formData.label} in ${org.label}/${env.label}`,{
                hideProgressBar:true,
                onClose:()=>{history.goBack()}
            })

        }else {
            toast.error(`An error was returned ${res.errors[0].message}`)
        }

    }

    return <Container>

        <Row>
            <Col xs={10}>
                <h4>Create your dataset <b className={`text-primary`}> {formData.label}</b></h4>
            </Col>
            <Col xs={12}>
                <If condition={submitting}>
                    <Then>
                        <Spinner variant={'primary'} animation={`border`}/>
                    </Then>
                </If>
            </Col>

        </Row>

        {
            (!submitting)?(
                <Background >

                    <Row>
                        <Col xs={4}>
                            {
                                (submitting)?(
                                    <Spinner animation={`border`} size={`lg`} variant={`primary`}/>

                                ):(
                                    <div/>
                                )
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={2}>
                            <b>Settings</b>
                        </Col>
                        <Col xs={10}>
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
                            <Row className={`mt-1`}>
                                <Col xs={1}><b>Lang</b></Col>
                                <Col xs={3}>
                                    <Select value={formData.language} onChange={selectLanguage} options={Languages}/>
                                </Col>
                                <Col xs={1}><b>Class</b></Col>
                                <Col xs={3}>
                                    <Select value={formData.confidentiality} onChange={selectConfidentiality} options={Classificiations}/>
                                </Col>
                            </Row>

                        </Col>
                    </Row>
                    <Row className={"mt-2"}>
                        <Col xs={2}><b>Admin Group</b></Col>
                        <Col xs={10}>
                            {/**
                            <input
                                className={`form-control`}
                                name={"SamlAdminGroupName"}
                                value={formData.SamlAdminGroupName}
                                onChange={handleChange}
                                style={{width:'100%'}}
                                placeholder={"Dataset admin group name"}/>**/}


                                <SelectGroup
                                    value={formData.SamlAdminGroupName}
                                    onChange={(opt)=>{setFormData({...formData, SamlAdminGroupName:opt})}}
                                />
                            {/**
                                <Select
                                    value={formData.SamlAdminGroupName}
                                    onChange={(opt)=>{setFormData({...formData, SamlAdminGroupName:opt})}}

                                    options={(groups&&groups||[]).map((g)=>{return {label : g, value: g}})}
                                />
                             **/}
                        </Col>
                    </Row>

                    <Row className={"mt-2"}>
                        <Col xs={2}><b>Business Owner</b></Col>
                        <Col xs={10}>
                            <input
                                className={`form-control`}
                                name={"owner"}
                                value={formData.owner}
                                onChange={handleChange}
                                style={{width:'100%'}}
                                placeholder={"Email of dataset business owner "}/>
                        </Col>
                    </Row>

                    <Row className={"mt-2"}>
                        <Col xs={2}><b>Stewards</b></Col>
                        <Col xs={10}>
                            <Creatable
                                isMulti
                                placeholder={`Emails for dataset stewards`}
                                onChange={selectStewards}
                                isClearable
                                options={[]}
                            />
                        </Col>
                    </Row>


                    <Row className={"mt-2"}>
                        <Col xs={2}><b>Label</b></Col>
                        <Col xs={10}>
                            <input className={`form-control`} name={"label"}  value={formData.label} onChange={handleChange} style={{width:'100%'}} placeholder={"name your dataset"}></input>
                        </Col>
                    </Row>
                    <Row className={"mt-2"}>
                        <Col xs={2}><b>Description</b></Col>
                        <Col xs={10}>
                            <textarea  value={formData.description} onChange={handleChange}  className={"form-control"} row={3} style={{resize:'None',width:'100%'}} name={"description"} placeholder={"name your dataset"}></textarea>
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
                                tags={tags}
                                onChange={(newTags) => setTags(newTags)}
                            />

                        </Col>
                    </Row>


                    <Row className={"mt-4"}>
                        <Col xs={2}><b></b></Col>
                        <Col xs={2}>
                            <div onClick={submitForm} className={"btn btn-sm btn-success"}>Save</div>
                        </Col>
                    </Row>


                </Background>
            ):(<div/>)
        }



    </Container>


}

export default NewDatasetForm;
