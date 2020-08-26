import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import {toast} from "react-toastify";
import useClient from "../../../api/client";
import TablePermissionListItem from "./TablePermissionListItem";
import listTablePermissions from "../../../api/Dataset/listTablePermissions";
import addTablePermission from "../../../api/Dataset/addTablePermission";
import removeTablePermission from "../../../api/Dataset/removeTablePermission";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



const TablePermissionList= (props)=>{

    const requiredRoles=['Owner','Admin'];
    const location = useLocation();
    let client = useClient();
    const [permissions, setPermissions]= useState({count:0, nodes:[]});



    const table= location.state.table;
    const dataset=  location.state.dataset;
    console.log("dataset=", dataset);
    console.log("table=", table);

    let canChangePermissions=false;
    if (requiredRoles.indexOf(dataset.userRoleForDataset)!=-1){
        canChangePermissions= true;
    }
    useEffect(()=>{
        if (client){
            client
                .query(listTablePermissions({tableUri:table.tableUri}))
                .then((res)=>{
                    if (!res.errors){
                        setPermissions(res.data.getDatasetTable.permissions);
                        toast(`Retrieved permissions`,{hideProgressBar:true})
                    }else{
                        toast.error(`Unexpected error ${res.errors[0].message}`,{hideProgressBar:true})
                    }
                })
                .catch((err)=>{
                    toast.error(`Unexpected error ${err.message}`,{hideProgressBar:true})
                })
        }
    },[client]);


    const removePermission= async ({userName})=>{
        const res= await client.mutate(
            removeTablePermission({
                tableUri:location.state.table.tableUri,
                userName : userName
            })
        );
        if (!res.errors){
            toast(`Remove permission for ${userName}`,{hideProgressBar:true});
            const refresh = await client
                .query(
                    listTablePermissions({tableUri:location.state.table.tableUri}
                ));
            console.log('-->  -->',refresh)
            setPermissions(refresh.data.getDatasetTable.permissions);

        }else {
            toast.error(`Unexpected error ${res.errors[0].message}`,{hideProgressBar:true})
        }

        toast("Removed Permission",{hideProgressBar:true});
    }

    const updatePermission= async ({userName,role})=>{
        const res = await client.mutate(
            addTablePermission({
                tableUri:location.state.table.tableUri,
                userName,
                role
            })
        );
        if (!res.errors){
            toast(`Updated Role for ${userName} to ${role}`,{hideProgressBar:true});
        }else {
            toast.error(`Unexpected error ${res.errors[0].message}`,{hideProgressBar:true})
        }

    }

    return <Container>
        <Row>
            <Col xs={1}>
                <Link
                    style={{color:'black'}}
                    to={{
                        pathname:`/dataset/${dataset.datasetUri}/tables`
                }}>
                    <h4><Icon.ChevronLeft size={32}/></h4>
                </Link>
            </Col>
            <Col xs={9}>
                <h5>Permissions on Table <b className={`text-primary`}>{table.GlueTableName}</b></h5>
            </Col>
            <Col xs={2}>
                {
                    (canChangePermissions)?(
                        <Link to={{
                            state:{
                                table :table
                            },
                            pathname:`/dataset/${dataset.datasetUri}/permissions/table/${table.tableUri}/new`
                        }}>
                            <div className={"btn bg-white border btn-sm"}>
                                Grant
                            </div>
                        </Link>

                    ):(
                        <div></div>
                    )
                }
            </Col>
        </Row>
        <Row className={`mt-3`}>
            <table className={`table table-sm`}>
                <thead>
                    <tr>
                        <th>
                            Username
                        </th>
                        <th>
                            Permission
                        </th>
                        <th>
                            Granted on
                        </th>
                        <th>
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                {
                    (permissions.count)?(
                        permissions.nodes.map((permission)=>{
                          return <TablePermissionListItem
                              key={permission.userName}
                              updatePermission={updatePermission}
                              removePermission={removePermission}
                              permission={permission}/>
                        })
                    ):(
                        <p><i>No Permissions Granted</i></p>
                    )
                }
                </tbody>
            </table>
        </Row>
    </Container>
}


export default TablePermissionList;
