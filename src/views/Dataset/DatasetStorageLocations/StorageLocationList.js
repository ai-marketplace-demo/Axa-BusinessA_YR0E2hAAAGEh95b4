import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import {toast} from "react-toastify";
import MainButton from "../../../components/MainActionButton/MainButton";
import useClient from "../../../api/client";
import getDataset from "../../../api/Dataset/getDataset";
import listDatasetStorageLocations from "../../../api/Dataset/listDatasetStorageLocations";
import updateDatasetContributor from "../../../api/Dataset/updateDatasetContributor";
import deleteDatasetStorageLocation from "../../../api/Dataset/removeDatasetStorageLocation";
import StorageLocationListItem from "./StorageLocationListItem";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


const Styled= styled.div`
height:100vh;
`

const StorageLocationList= (props)=>{
    let client = useClient();
    const required_permissions=[
        'BusinessOwner',
        'DataSteward',
        'Creator',
        'Admin'
    ];
    let actionsDisabled= true;
    if (required_permissions.indexOf(props.dataset.userRoleForDataset)!=-1 ){
        actionsDisabled =false;
    }
    let [locations, setLocations] = useState({count:0, nodes:[]})

    useEffect(()=>{
        if (client){
            client
                .query(listDatasetStorageLocations(props.dataset.datasetUri))
                .then((res)=>{
                    if (!res.errors){
                        setLocations(res.data.getDataset.locations);
                    }else {
                        toast.error(`Could not retrieve storage locations, received ${res.errors[0].message} `)
                    }
                })
                .catch((err)=>{
                    toast.err("Unexpected Error", {hideProgressBar:true})
                })

        }
    },[client])


    const onDelete=async ({locationUri})=>{
        const res = await client.mutate(deleteDatasetStorageLocation({locationUri}));
        if (!res.errors){
            toast(`Deleted storage location ${locationUri}`,{hideProgressBar:true})
        }else{
            toast.error(`Could not delete storage locations, received ${res.errors[0].message} `)
        }
    }
    return <Styled><Container>
        <Row>
            <Col xs={8}>
                <h4><Icon.Folder size={24}/> Storage Locations</h4>
            </Col>
            <Col xs={4}>
                {
                    (actionsDisabled)?(
                        <div></div>
                    ):(
                        <MainButton>
                            <Link to={'newstoragelocation'}>
                                Add  Location
                            </Link>
                        </MainButton>
                    )
                }
            </Col>
        </Row>
        <Row className={`mt-3`}>
            <Col xs={12}>
            {
                (locations.count)?(
                   <table className={"table table-sm"}>
                       <tr>
                           <th>
                               Prefix
                           </th>
                           <th>
                               Path
                           </th>
                           <th>
                               Created
                           </th>
                           <th>

                           </th>
                       </tr>
                       <tbody>
                       {
                           locations.nodes.map((location)=>{
                               return <StorageLocationListItem
                                   key={location.locationUri}
                                   location={location}
                                   delete={onDelete}
                                   dataset={props.dataset}
                               />
                           })
                       }
                       </tbody>
                   </table>
                ):(
                    <p><i>No Locations Found.</i></p>
                )
            }
            </Col>
        </Row>
    </Container>
    </Styled>
}


export default StorageLocationList;
