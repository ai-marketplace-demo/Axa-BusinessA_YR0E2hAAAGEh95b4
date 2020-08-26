import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
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



const StyledForm=styled.div`
height: 12rem;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
border-left:  4px solid lightseagreen;

box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`

const SearchResult=styled.div`
z-index: 333;
height: 5rem;
border :1px solid black;
`

const BaseStyle=styled.div`
z-index: 0;`

const NewShareObjectForm= (props)=>{
    let history = useHistory();
    let client = useClient();

    let [formData,setFormData]=useState({
        label:'',
        organizationUri : ''
    });

    let [suggestions, setSuggestions]= useState([])
    let [lastFetch, setLastFetch] = useState(null);
    let [isFetching, setIsFetching] = useState(false);
    let [isSelected, setIsSelected] = useState(false);

    const selectOrganization=(org)=>{
        setIsFetching(false);
        setSuggestions([]);
        setFormData({...formData, ...org});
        setIsSelected(true)

    }



    const handleInputChange=async (e)=>{
        setFormData({...formData,[e.target.name] : e.target.value});
        setIsSelected(false);
    }



    useEffect(()=>{
        if (client){
            if (!formData.label){
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
                setLastFetch(new Date());
                client
                    .query(
                        listOrganizations({filter:{
                            term:formData.label
                        }
                    })
                    )
                    .then((res)=>{
                        if (!res.errors){
                            if (res.data.listOrganizations.count) {
                                setSuggestions(res.data.listOrganizations.nodes)
                            }
                        }else{
                            toast.error(`Could not retrieve organizations, received ${res.errors[0].message}`)
                        }
                    })
                    .catch((err)=>{
                        toast.error(`Unexpected error when retrieving organizations, received ${err.message}`)
                    })
                    .finally(()=>{
                        setIsFetching(false)
                    })
            }

        }
    },[client, formData.label])



    const onSubmit=async ()=>{
        const res= await client.mutate(
            createShareObject({
                datasetUri:props.dataset.datasetUri,
                input:{
                    organizationUri : formData.organizationUri,
                    label : formData.label
                }
            })
        )
        if (!res.errors){
            toast(`Added share object  ${formData.label} `,{
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
            <Col xs={8}>
                <h4>Create New Share Object</h4>
            </Col>
        </Row>
        <StyledForm>
        <Row className={"mt-4"}>
            <Col xs={1}/>
            <Col xs={2}><b>Organization</b></Col>
            <Col xs={4}>
                <input className={`form-control`} name={'label'} onChange={handleInputChange} style={{width:'100%'}} value={formData.label}/>
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
        <Row>
            <Col xs={3}/>
            <Col xs={4}>

                {(suggestions)?(
                    suggestions.map((suggestion)=>{
                        return <div className={"list-group"} key={suggestion.organizationUri}>
                            <div  className={"list-group-item"}>
                                <Avatar className={`mr-3`} size={24} round={true} name={suggestion.label}/>
                                <b onClick={()=>{selectOrganization(suggestion)}}>{suggestion.label}({suggestion.organizationUri})</b>
                            </div>
                        </div>
                    })
                ):(
                    <div/>
                )}
            </Col>
        </Row>

        <Row className={"mt-2"}>
            <Col xs={3}/>
            <Col xs={4}>
                {
                    formData.organizationUri?(
                        <div onClick={onSubmit} className={"btn-sm btn btn-primary"}>Create Share Object for <b>{formData.label}({formData.organizationUri})</b></div>
                    ):(
                        <div/>
                    )
                }
            </Col>
        </Row>
        </StyledForm>
    </Container>
}


export default NewShareObjectForm;
