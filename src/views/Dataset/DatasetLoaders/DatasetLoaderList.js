import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import {toast} from "react-toastify";
import useClient from "../../../api/client";
import MainButton from "../../../components/MainActionButton/MainButton";
import listDatasetLoaders from "../../../api/Dataset/listDatasetLoaders";
import removeDatasetLoader from "../../../api/Dataset/removeDatasetLoader";
import DatasetLoaderListItem from "./DatasetLoaderListItem";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


const Styled=styled.div`
height:100vh;
`


const DatasetLoaderList= (props)=>{

    let client     =useClient();

    let [loaders, setLoaders] = useState({
        count:0,
        pageSize:3,
        page:1,
        pages:1,
        hasNext:false,
        hasPrevious:false,
        nodes:[]
    })

    let [ready, setReady] = useState(false);

    const fetchItems=async ()=>{
        const response = await client
            .query(listDatasetLoaders({
                datasetUri:props.dataset.datasetUri,
                filter:{
                    page : loaders.page,
                    pageSize:3
                }
            }));
        if (!response.errors){
            toast(`Fetched  ${response.data.getDataset.loaders.count} loaders`)
            setLoaders({...response.data.getDataset.loaders})
        }else {
            toast.warn(`Could not retrieve loader, received ${response.errors[0].message}`)
        }
        setReady(true);

    }
    const removeLoader = async ({loaderUri})=>{
        const res =await client.mutate(
            removeDatasetLoader({loaderUri})
        )
        if (!res.errors){
            toast(`Removed loader ${loaderUri}`);
            if (loaders.page==1){
                fetchItems();
            }else {
                setLoaders({...loaders, page:1})
            }
        }else {
            toast.error(`Could not remove of ${loaderUri}, received ${res.errors[0].message}`)
        }
    }
    const nextPage=()=>{
        if (loaders.hasNext){
            setLoaders({...loaders,page:loaders.page+1})
        }
    }
    const prevPage=()=>{
        if (loaders.hasPrevious){
            setLoaders({...loaders,page:loaders.page-11})
        }
    }



    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client,loaders.page])


    return <Styled>
        <Container>
        <Row className={``}>
            <Col xs={8}>
                <h4><Icon.Download size={24}/>Trusted Loaders for <b className={`text-primary`}>{props.dataset.label}</b></h4>
            </Col>
            <Col xs={4}>
                <MainButton>
                    <Link
                        to={`/dataset/${props.dataset.datasetUri}/newloader`}>
                       Add Loader
                    </Link>
                </MainButton>
            </Col>
            <Col xs={4}>
                <i>
                    Found {loaders.count} results
                </i>
            </Col>
            <Col xs={4}>
                <Row>
                    <Col className={`text-right`}  xs={4}>
                        <Icon.ChevronLeft onClick={prevPage}>Previous</Icon.ChevronLeft>
                    </Col>
                    <Col className={`text-center`} xs={4}>
                        Page {loaders.page}/{loaders.pages}
                    </Col>
                    <Col xs={4}>
                        <Icon.ChevronRight onClick={nextPage}>Next</Icon.ChevronRight>
                    </Col>
                </Row>

            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={12}>
                <table className={"table table-sm"}>
                    <thead>
                    <tr>
                        <th>Iam Role</th>
                        <th>Label</th>
                        <th>Created</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        loaders.count&&loaders.nodes.map((loader)=>{
                            return <DatasetLoaderListItem
                                key={loader.loaderUri}
                                dataset={props.dataset}
                                removeLoader={removeLoader}
                                loader={loader}/>
                        })
                    }
                    </tbody>
                </table>
            </Col>
        </Row>
    </Container>
    </Styled>
}


export default DatasetLoaderList;
