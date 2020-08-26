import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import {toast} from "react-toastify";
import useClient from "../../../api/client";
import getDataset from "../../../api/Dataset/getDataset";
import listDatasetContributors from "../../../api/Dataset/listDatasetContributors";
import updateDatasetContributor from "../../../api/Dataset/updateDatasetContributor";
import removeDatasetContributor from "../../../api/Dataset/removeDatasetContributor";
import DatasetShareeListItem from "./DatasetShareeListItem";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



const DatasetShareeList= (props)=>{

    const options=[
        {label: 'Can Read All',value:'TotalShare'},
        {label : 'Can Discover All', value:"TotalDiscover"}
    ];

    const removeContributor = async ({userName})=>{
        const res =await client.mutate(
            removeDatasetContributor({userName,datasetUri:props.dataset.datasetUri})
        )
        if (!res.errors){
            toast(`Removed ${userName}`);
            const refresh = await client.query(listDatasetContributors(props.dataset.datasetUri));
            setContributors(refresh.data.getDataset.contributors)

        }else {
            toast.error(`Could not remove of ${userName}, received ${res.errors[0].message}`)
        }
    }

    const updateDatasetContributorRole=async ({userName,role})=>{
        const res =await client.mutate(
            updateDatasetContributor({userName,role,datasetUri:props.dataset.datasetUri})
        )
        if (!res.errors){
            toast(`Updated role of ${userName} to ${role}`)
        }else {
            toast.error(`Could not change role of ${userName}, received ${res.errors[0].message}`)
        }
    }


    let [contributors, setContributors] = useState({
        count:0,
        pageSize:3,
        page:1,
        hasNext:false,
        hasPrevious:false,
        nodes:[]
    })
    let client     =useClient();

    const nextPage=()=>{
        if (contributors.hasNext){
            setContributors({...contributors,page:contributors.page+1})
        }
    }
    const prevPage=()=>{
        if (contributors.hasPrevious){
            setContributors({...contributors, page:contributors.page-1})
        }
    }

    useEffect(()=>{
        if (client){
            client
                .query(listDatasetContributors({
                    datasetUri:props.dataset.datasetUri,
                    filter:{
                        page : contributors.page,
                        pageSize:3,
                        roles:['TotalShare','TotalDiscover']
                    }
                }))
                .then((res)=>{
                    if (!res.errors){
                        console.log("coool");
                        console.log(res);
                        setContributors(res.data.getDataset.contributors)
                    }
                })
                .catch((err)=>{
                    console.log("err = ", err);
                })

        }
    },[client,contributors.page])
    return <Container>
        <Row className={``}>
            <Col xs={8}>
                <h4>Current shares for <b className={`text-primary`}>{props.dataset.label}</b></h4>
            </Col>
            <Col xs={4}>
                <Link to={`newdatasetshare`}>
                    <div className={"btn-sm btn bg-white border"}>Share</div>
                </Link>
            </Col>
            <Col xs={4}>
                <i>
                    Found {contributors.count} results
                </i>
            </Col>
            <Col xs={4}>
                <Row>
                    <Col xs={4}>
                        {(contributors.hasPrevious)?(<Icon.ChevronLeft onClick={prevPage}>Previous</Icon.ChevronLeft>):(<div/>)}
                    </Col>
                    <Col xs={4}>
                        Page {contributors.page}/{contributors.pages}
                    </Col>
                    <Col xs={4}>
                        {(contributors.hasNext)?(<Icon.ChevronRight onClick={nextPage}>Next</Icon.ChevronRight>):(<div/>)}
                    </Col>
                </Row>

            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={12}>
                <table className={"table table-sm"}>
                    <thead>
                    <tr>
                        <th>User name</th>
                        <th>Env Role</th>
                        <th>Permission</th>
                        <th>Granted</th>

                        <th>Remove</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        contributors.nodes.map((permission)=>{
                            return <DatasetShareeListItem
                                key={permission.userName}
                                dataset={props.dataset}
                                updateContributorRole={updateDatasetContributorRole}
                                removeContributor={removeContributor}
                                permission={permission}/>
                        })
                    }
                    </tbody>
                </table>
            </Col>
        </Row>
    </Container>
}


export default DatasetShareeList;
