import React ,{useEffect,useState} from "react";
import {Col, Row, Container, Spinner} from "react-bootstrap";
import {If, Then, Else} from "react-if";
import * as Icon from  "react-bootstrap-icons";
import styled from "styled-components";
import MainActionButton from "../../components/MainActionButton/MainButton";
import {Link} from "react-router-dom";
import useClient from "../../api/client";
import searchDashboards from "../../api/Dashboard/searchDashboards";
import {toast} from "react-toastify";
import DashboardListItem from "./DashboardListItem";

const Styled=styled.div`
height:100vh;
`


const DashboardList = function(){
    const client = useClient();

    const [dashboards,setDashboards] =useState({
        count:  0,
        page : 1,
        pages:1,
        hasNext:false,
        hasPrevious : false,
        nodes:[]
    })

    const fetchItems= async()=>{
        const response = await client.query(
            searchDashboards({})
        )
        if (!response.errors){
            toast(`Restrieved ${response.data.searchDashboards.count} dashboards`);
            setDashboards(response.data.searchDashboards);
        }else {
            toast(`Received ${response.errors[0].message}`);
        }
    }

    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client,dashboards.page])
    return <Styled>
        <Container className={""}>
            <Row>
                <Col xs={3}>
                    <h3> <Icon.ClipboardData/> My Dashboards</h3>
                </Col>
                <Col xs={7}>
                    <Row className={`mt-2`}>
                        <Col xs={4}><i>Found {dashboards.count} results</i></Col>
                        <Col className={`pt-1 text-right`} xs={2}><Icon.ChevronLeft onClick={()=>{}}/></Col>
                        <Col className={` text-center`} xs={4}>Page {dashboards.page}/{dashboards.pages}</Col>
                        <Col className={`pt-1 text-left`} xs={2}><Icon.ChevronRight onClick={()=>{}}/></Col>
                    </Row>
                </Col>
                <Col xs={1} className={`mt-2`}>
                    <MainActionButton>
                        <Link to={"/newdashboard"}>
                            Create
                        </Link>
                    </MainActionButton>
                </Col>
            </Row>
            <Row className={"mt-3"}>
                <Col xs={12}>
                    <input className={"form-control"} name={'search'} value={''} onKeyDown={()=>{}} onChange={()=>{}} placeholder={"search your dashboards"} style={{width:'100%'}}/>
                </Col>

            </Row>

            <Row className={`mt-3`}>
                <If condition={dashboards.count}>
                    <Then>
                        {
                            dashboards.nodes.map((dashboard)=>{
                                return <Col xs={4}>
                                    <DashboardListItem dashboard={dashboard}/>
                                </Col>
                            })
                        }
                    </Then>
                    <Else>
                        <div></div>
                    </Else>

                </If>

            </Row>
        </Container>
    </Styled>

}


export default DashboardList;
