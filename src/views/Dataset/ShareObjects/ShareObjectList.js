import React, {useState,useEffect} from "react";
import * as Icon from "react-bootstrap-icons";
import {Row,Col,Container,Spinner} from "react-bootstrap";
import {Link, useParams, useHistory, useLocation} from "react-router-dom";
import useClient from "../../../api/client";
import {toast} from "react-toastify";
import { If, Then, Else, When, Unless, Case, Default } from 'react-if';
import ShareObjectListItem from "./ShareObjectListItem"
import listDatasetShareObjects from "../../../api/ShareObject/listDatasetShareObjects";
import MainButton from "../../../components/MainActionButton/MainButton";

const ShareObjectList=(props)=>{
    let client = useClient();

    let [isLoading, setIsLoading] = useState(true)
    let [shareObjects, setshareObjects] = useState({
        count:0,
        nodes:[],
        page:1,
        pages:0,
        hasNext:false,
        hasPrevious:false
    });

    let canEdit = ['Owner','Admin'].indexOf(props.dataset.userRoleForDataset)!=-1

    const fetchItems=async ()=>{
        const response = await client
            .query(
                listDatasetShareObjects({datasetUri:props.dataset.datasetUri})
            )
        if (!response.errors){
            setshareObjects({...response.data.getDataset.shares});
            setIsLoading(false);

        }else{
            toast.warn(`Could not retrieve shares for ${props.dataset.label}`)
        }
    }
    useEffect(()=>{
        if (client){
            fetchItems()
        };
    },[client, isLoading])

    return <Container>
        <Row>
            <Col xs={8}>
                <h4><Icon.Arrow90degRight size={24}/> Share Objects for <b className={`text-primary`}>{props.dataset.label}</b></h4>
            </Col>
        </Row>
        <Row className={`mt-3`}>

            <Col xs={10}>
                <Row>
                    <Col xs={4}><i>Found {shareObjects.count} results</i></Col>
                    <Col xs={2}><Icon.ChevronLeft/></Col>
                    <Col xs={4}>Page {shareObjects.page}/{shareObjects.pages}</Col>
                    <Col xs={2}><Icon.ChevronRight/></Col>
                </Row>
            </Col>
            <Col xs={2}>
                <If condition={canEdit}>
                    <Then>
                        <MainButton>
                            <Link to={{
                                pathname:`/dataset/${props.dataset.datasetUri}/newshareobject`
                            }}>
                                <div className={``}>Create</div>
                            </Link>
                        </MainButton>
                    </Then>
                </If>

            </Col>
            <Col className={`pt-2`} xs={12}>
                <input className={`form-control`} style={{width:"100%"}}/>
            </Col>
        </Row>
        <Row className={`mt-1`}>
            <Col xs={12}>
            {
                (isLoading)?(
                    <Spinner animation="border" variant="primary" />
                ):(
                    <table className={`table table-sm`}>
                        <tr>
                            <th>
                                Shared with
                            </th>
                            <th>
                                Tables
                            </th>
                            <th>
                                Locations
                            </th>
                            <th>
                                Created
                            </th>
                            <th>
                                By
                            </th>
                            <th>
                                Status
                            </th>
                        </tr>
                        <tbody>
                        {
                            (shareObjects.count)?(
                                shareObjects.nodes.map((shareObject)=>{
                                    return <ShareObjectListItem key={shareObject.shareUri}
                                                                dataset={props.dataset}
                                                                shareObject={shareObject}/>
                                })
                            ):(
                                <p>No share object created</p>
                            )
                        }
                        </tbody>
                    </table>
                )



            }
            </Col>
        </Row>

    </Container>




}

export default ShareObjectList;
