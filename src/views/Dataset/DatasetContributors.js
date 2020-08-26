import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import useClient from "../../api/client";
import getDataset from "../../api/Dataset/getDataset";
import listDatasetContributors from "../../api/Dataset/listDatasetContributors";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



const DatasetContributors= (props)=>{

    const options=[
        {label: 'Admin',value:'Admin'},
        {label: 'ReadWrite',value:'ReadWrite'},
        {label: 'DiscoverAll',value:'ReadWrite'},
        {label: 'ReadAll',value:'ReadWrite'},
    ];

    let _contributors=[
        {userName:'x', role:'xxx',created:new Date()},
        {userName:'y', role:'xxx',created:new Date()},
        {userName:'z', role:'xxx',created:new Date()},
        {userName:'r', role:'xxx',created:new Date()},
        {userName:'c', role:'xxx',created:new Date()},
    ];
    let [contributors, setContributors] = useState({count:0, nodes:[]})
    let client     =useClient();
    useEffect(()=>{
        if (client){
            client
                .query(listDatasetContributors(props.dataset.datasetUri))
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
    })
    return <Container>
        <Row className={`mt-4`}>
            <Col xs={8}>
                <h4>Contributors</h4>
            </Col>
            <Col xs={4}>
                <Link to={`newdatasetcontributor`}>
                    <div className={"btn-sm btn bg-white border"}>Add Contributor</div>
                </Link>
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={12}>
                <table className={"table table-sm"}>
                    <thead>
                        <tr>
                            <th>User name</th>
                            <th>Env Role </th>
                            <th>Permission</th>
                            <th>Granted</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            contributors.nodes.map((permission)=>{
                                return <tr>
                                    <td>{permission.userName}</td>
                                    <td>{permission.userRoleInEnvironment}</td>
                                    <td>
                                        <Select value={{value:permission.userRoleForDataset,label:permission.userRoleForDataset}} style={{height:'0.8rem'}} options={options}/>
                                    </td>
                                    <td>{dayjs(permission.created).fromNow()}</td>
                                    <td>
                                        <div className={"btn-sm btn bg-white border"}>Remove</div>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                    </table>
            </Col>
        </Row>
    </Container>
}


export default DatasetContributors;
