import React ,{useState,useEffect} from "react";
import {Container, Table,Row, Badge,Col,Spinner} from "react-bootstrap";
import {If, Then , Else} from "react-if";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import MainButtonAction from "../../components/MainActionButton/MainButton";
import {Link,useParams,useLocation} from "react-router-dom"
import EnvironmentListItem from "./EnvironmentListItem";
import useClient from "../../api/client";
import listEnvironments from "../../api/Environment/listEnvironments";
import {toast} from "react-toastify";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
import Pager from "../../components/Pager/Pager";
dayjs.extend(relativeTime)

const Styled=styled.div`
height: 100vh;

`



const EnvironmentList=(props)=>{

    let params= useParams();
    let location = useLocation();
    let client = useClient();
    let [ready, setReady] = useState(false);
    let [envs,setEnvironments] = useState({
        count:0,
        nodes:[],
        page:1,
        hasNext:false,
        hasPrevious:false,
        pageSize:10,
        pages:0
    });
    let canLink=false;
    let [search, setSearch] = useState('');
    let [sortCriterias, setSortCriterias]=useState({label:'asc',created:'desc'});

    const fetchItems = async ()=>{
        setReady(false);
        const response = await client
            .query(listEnvironments({
                filter:{
                    term :search,
                    page:  envs.page,
                    roles:[],
                    pageSize: envs.pageSize
                }
            }));
        if (!response.errors){
            setEnvironments(response.data.listEnvironments);
        }else {
            toast.error(`Failed to refresh environments, received ${response.errors[0].message}`)
        }
        setReady(true);
    }

    const handleInputChange = async (event)=>{
        setSearch(event.target.value);
    }

    const handleChangeSort =async (field)=>{
        setSortCriterias({...sortCriterias,[field]:sortCriterias[field]=='asc'?'desc':'asc'});
    }

    const handleKeyDown = async (e)=>{
        if (e.key === 'Enter') {
            await fetchItems();
        }
    }

    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client,envs.page]);

    const nextPage =()=>{
        if(envs.hasNext){
            setEnvironments({...envs, page:envs.page+1})
        }
    }

    const prevPage=()=>{
        if(envs.hasPrevious){
            setEnvironments({...envs, page:envs.page-1})
        }
    }
    return <Styled>
        <Container fluid className={`mt-4`}>
            <Row>
                <Col xs={10}>
                    <h3>   <Icon.Cloud size={32}/> My Environments </h3>
                </Col>
            </Row>
            <Row className={`mt-4`}>
                <Col xs={12}>
                    <Pager
                        label={`environment(s)`}
                        count={envs.count}
                        page={envs.page}
                        pages={envs.pages}
                        next={nextPage}
                        previous={prevPage}
                        onKeyDown={handleKeyDown}
                        onChange={handleInputChange}
                    />
                </Col>
                {/**

                <Col xs={3}><i>Found <b>{envs.count}</b> results</i></Col>
                <Col xs={4}>
                    <Row>
                        <Col className={`text-right pt-2`}><Icon.ChevronLeft onClick={prevPage}/></Col>
                        <Col className={`text-center`}>Page {envs.page}/{envs.pages}</Col>
                        <Col className={`text-left pt-2`}><Icon.ChevronRight onClick={nextPage}/></Col>
                    </Row>
                </Col>
                <Col xs={3}/>

                <Col className={`mt-1`} xs={12}>
                    <input className={`form-control`} onKeyDown={handleKeyDown} onChange={handleInputChange} value={search} placeholder={'search environments'} style={{width:"100%"}}/>
                </Col>
                 **/}
            </Row>

            <Row className={"mt-4"}>
                <If condition={!ready}>
                    <Then>
                        <Col xs={12}>
                        <Spinner variant="info" animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                        </Col>
                    </Then>
                    <Else>
                        <If condition={envs.count}>
                            <Then>
                                {
                                    envs.nodes.map((env)=>{
                                        return <Col xs={4}>
                                            <EnvironmentListItem
                                                key={env.environmentUri}
                                                environment={env}
                                                organization={location.state}
                                            />
                                        </Col>
                                    })
                                }
                            </Then>
                            <Else>
                                <Col xs={12}>
                                    <p><i>No Environments found (or accessible to you) in this organization</i></p>
                                </Col>
                            </Else>
                        </If>
                    </Else>
                </If>

            </Row>
        </Container>
    </Styled>
}


export default EnvironmentList;
