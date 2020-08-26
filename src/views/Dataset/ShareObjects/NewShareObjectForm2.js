import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge,Dropdown} from "react-bootstrap";
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
import searchPrincipal from "../../../api/Principal/searchPrincipal";
import createShareObject from "../../../api/ShareObject/createShareObject";

import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const Styled=styled.div`
height: 15rem;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
border-left:  4px solid lightseagreen;

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
    let history = useHistory();
    let location =useLocation();
    let principal = location.state&&location.state.principal;

    let client = useClient();

    let [formData,setFormData]=useState({
        principalName:'',
        principalType: 'Environment',
        principalId: ''
    });

    let [suggestions, setSuggestions]= useState([])
    let [lastFetch, setLastFetch] = useState(null);
    let [isFetching, setIsFetching] = useState(false);
    let [isSelected, setIsSelected] = useState(false);


    const selectPrincipal=(principal)=>{
        setIsFetching(false);
        setSuggestions([]);
        setFormData({...formData, ...principal});
        setIsSelected(true)

    }



    const handleInputChange=async (e)=>{
        setFormData({...formData,[e.target.name] : e.target.value});
        setIsSelected(false);
    }



    useEffect(()=>{
        if (client){
            if (!formData.principalName){
                setSuggestions([]);
                setIsFetching(false);
                return
            }
            if (isSelected){
                return;
            }
            const dif = lastFetch?new Date().getTime()-lastFetch.getTime():1000;

            if (dif>200&!isFetching){
                setIsFetching(true);
                //setFormData({...formData,principalName: ""})
                setLastFetch(new Date());
                client
                    .query(
                        searchPrincipal({filter:{
                                term:formData.principalName,
                                principalType:formData.principalType
                            }
                        })
                    )
                    .then((res)=>{
                        if (!res.errors){
                            if (res.data.searchPrincipal.count) {
                                setSuggestions(res.data.searchPrincipal.nodes)
                            }
                        }else{
                            toast.error(`Could not retrieve principals, received ${res.errors[0].message}`)
                        }
                    })
                    .catch((err)=>{
                        toast.error(`Unexpected error when retrieving principals, received ${err.message}`)
                    })
                    .finally(()=>{
                        setIsFetching(false)
                    })
            }

        }
    },[client, formData.principalName])



    const onSubmit=async ()=>{
        const res= await client.mutate(
            createShareObject({
                datasetUri:props.dataset.datasetUri,
                input:{
                    principalId : formData.principalId,
                    principalType: formData.principalType,
                    label : formData.principalName,
                }
            })
        )
        if (!res.errors){
            toast(`Added share object  ${formData.principalName} `,{
                hideProgressBar:true
            })
        }else {
            toast.error(`Could not add contributor, received ${res.errors[0].message}`,{
                hideProgressBar:true
            })
        }

    }


    return <Container>
        <Row className={"mt-2"}>
            <Col xs={1}>

                <Link style={{color:`black`}} to={`/dataset/:${props.dataset.datasetUri}/shares`}>
                    <h4><Icon.ChevronLeft xs={36}/></h4>
                </Link>
            </Col>
            <Col xs={5}>
                <h4>Create Newsss Share Object</h4>
            </Col>
            <Col xs={2}>
                {
                    (isFetching)?(
                        <Spinner animation="grow" size="sm" />
                    ):(
                        <div/>
                    )
                }
            </Col>

        </Row>
        <Styled>
            <Row className={`mt-4`}>
                <Col xs={12}>
                    <div className="input-group mb-0">
                        <div className="input-group-prepend">
                            <button className="btn btn-outline-secondary dropdown-toggle" type="button"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Principal Type
                            </button>
                            <div className="dropdown-menu">
                                <div onClick={()=>{setFormData({...formData,principalType: 'Any'})}} className="dropdown-item" >Any</div>
                                <div onClick={()=>{setFormData({...formData,principalType: 'Public'})}} className="dropdown-item" >Public</div>
                                <div onClick={()=>{setFormData({...formData,principalType: 'Organization'})}} className="dropdown-item" >Organization</div>
                                <div onClick={()=>{setFormData({...formData,principalType: 'Project'})}} className="dropdown-item" >Project</div>
                                <div onClick={()=>{setFormData({...formData,principalType: 'Environment'})}} className="dropdown-item" >Environment</div>
                                {/**<div onClick={()=>{setFormData({...formData,principalType: 'User'})}} className="dropdown-item" >User</div>**/}
                            </div>
                        </div>
                        <div  className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">{formData.principalType}</span>
                        </div>
                        <input placeholder={`search for orgas, users, or projects`} className={`form-control`} name={'principalName'} onChange={handleInputChange} style={{width:'100%'}} value={formData.principalName}/>
                    </div>
                </Col>

            </Row>

            <Row className={`m-0`}>
                <Col xs={12}>
                    {(suggestions)?(
                        suggestions.map((suggestion)=>{
                            return <Row  key={suggestion.principalId}>
                                <SearchResult>
                                    <Col xs={12} className={"border-bottom pt-3 pb-3 border-top "}>
                                        <Avatar className={`m-0`} size={24} round={true} name={suggestion.principalType}/>
                                        <b onClick={()=>{selectPrincipal(suggestion)}}>{suggestion.principalName}({suggestion.principalId})</b>
                                    </Col>
                                </SearchResult>
                            </Row>
                        })
                    ):(
                        <div/>
                    )}
                </Col>
            </Row>
            {
                (isFetching)?(
                    <div/>
                ):(
                    <Row className={"mt-2"}>
                        <Col xs={12}>
                            {
                                formData.principalId?(
                                    <div style={{width:'100%'}} onClick={onSubmit} className={"btn-sm btn btn-primary"}>
                                        Create Share Object for <b>{formData.principalType} {formData.principalName}({formData.principalId})</b></div>
                                ):(
                                    <div/>
                                )
                            }
                        </Col>
                    </Row>
                )
            }
        </Styled>

    </Container>
}


export default NewShareObjectForm;
