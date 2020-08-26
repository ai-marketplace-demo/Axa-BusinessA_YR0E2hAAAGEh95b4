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
import listOrganizationUsers  from "../../../api/Organization/listOrganizationUsers"

import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


const SearchResult=styled.div`
z-index: 333;
height: 5rem;
border :1px solid black;
`

const BaseStyle=styled.div`
z-index: 0;`

const NewDatasetContributor= (props)=>{
    let history = useHistory();
    let client = useClient();
    let options=[
        {
            label : 'ReadWrite', value:"ReadWrite",
        },
        {
            label : 'Admin', value:"Admin",
        }
    ]
    let [formData,setFormData]=useState({
        userName:'',
        role:options[0],
    });

    let [suggestions, setSuggestions]= useState([])
    let [lastFetch, setLastFetch] = useState(null);
    let [isFetching, setIsFetching] = useState(false);
    let [isSelected, setIsSelected] = useState(false);

    const selectUser=(userName)=>{
        setIsFetching(false);
        setSuggestions([]);
        setFormData({...formData, userName:userName});
        setIsSelected(true)

    }

    const handleInputChange=async (e)=>{
        setFormData({...formData,[e.target.name] : e.target.value});
        setIsSelected(false);
    }





    useEffect(()=>{
        if (client){
            if (!formData.userName){
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
                        listOrganizationUsers({
                            filter:{
                                term :formData.userName
                            },
                            organizationUri:props.dataset.organization.organizationUri
                        }))
                        .then((res)=>{
                            if (res.data.getOrganization.users.count){
                                setSuggestions(res.data.getOrganization.users.nodes)
                            }
                        })
                        .catch((err)=>{
                            toast.error("!!!!")
                        })
                        .finally(()=>{
                            setIsFetching(false)
                        })
            }

        }
    },[client, formData.userName])



    const onSubmit=async ()=>{
        const res= await client.mutate(
            addDatasetContributor({
                userName:formData.userName,
                role : formData.role.value,
                datasetUri:props.dataset.datasetUri
            })
        )
        if (!res.errors){
            toast(`Added new contributor ${formData.userName} `,{
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
                <Link
                    style={{color:'black'}}
                    to={'contributors'}>
                    <h4><Icon.ChevronLeft xs={36}/></h4>
                </Link>
            </Col>
            <Col xs={8}>
                <h4>Add New Contributor To Dataset</h4>
            </Col>
        </Row>
        <Row className={"mt-4"}>
            <Col xs={1}/>
            <Col xs={2}>Username</Col>
            <Col xs={4}>
                <input name={'userName'} onChange={handleInputChange} style={{width:'100%'}} value={formData.userName}/>
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
                    return <div className={"list-group"} key={suggestion.userName}>
                        <div  className={"list-group-item"}>
                            <Avatar className={`mr-3`} size={24} round={true} name={suggestion.userName}/>
                        <b onClick={()=>{selectUser(suggestion.userName)}}>{suggestion.userName}</b>
                        </div>
                    </div>
                })
            ):(
                <div/>
            )}
            </Col>
        </Row>
        <Row style={{zIndex:'-1'}}className={"mt-2"}>
            <Col xs={1}/>
            <Col xs={2}>Role</Col>
            <Col xs={4}>
                <Select
                    name='role'
                    onChange={(selectOption)=>{handleInputChange({target:{name:'role', value:selectOption}})}}
                    value={formData.role}
                    options={options}/>
            </Col>
        </Row>
        <Row className={"mt-2"}>
            <Col xs={3}/>
            <Col xs={4}>
                <div onClick={onSubmit} className={"btn-sm btn btn-primary"}>Add</div>
            </Col>
        </Row>
    </Container>
}


export default NewDatasetContributor;
