import React , {useState, useEffect} from "react";
import {If, Then, Else} from "react-if";
import {Container, Row, Col,Badge} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import Zoom from "../Zoomer/Zoom";
import styled from "styled-components";
import {Link} from "react-router-dom";
import useClient from "../../api/client";
import getUserRoleInTenant from "../../api/Tenant/getUserRoleInTenant";

const SidebarStyled = styled.div`
a{
    font-size: 0.9em;
    margin-top: 0;
    outline: 0;
    color : black;
    background-color: lavender;
    font-weight: lighter;
}
a:link, a:visited{
    text-decoration:none;
}
div.sidebarlink{
  margin-top: 0px;
}
`

const Hoverable=styled.div`
&:hover{
  background-color: ghostwhite;
}
`

const Sidebar = (props) => {
    let client = useClient();
    let [notifications,setNotfications]= useState(0);
    let [isTenantAdmin, setisIsTenantAdmin] = useState(false);

    const fetchData = async()=>{
        const response=await client.query(getUserRoleInTenant());
        if (!response.errors){
            if (['Admin','Owner'].indexOf(response.data.getUserRoleInTenant)!=-1){
                setisIsTenantAdmin(true)
            }
        }

    }
    useEffect(()=>{
        if(client){
            fetchData();

        }

    },[client]);

    return <SidebarStyled>
        {props.open ? (
            <Container className={"pl-3"}>
                <Row>
                    <Col xs={9}/>
                    <Col xs={2} className={""}>
                        <Zoom color={"black"}>
                            <Icon.ArrowBarLeft size={28} onClick={props.close}/>
                        </Zoom>
                    </Col>
                </Row>

                <Hoverable color={"black"}>
                    <Row className={"mt-1"}>
                        <Col className="" xs={1}>
                            <Icon.Cloud/>
                        </Col>
                        <Col>
                            <Link className={"pt-4 "} to={"/home"}><h6>Home</h6></Link>
                        </Col>
                    </Row>
                </Hoverable>
                <Hoverable color={"black"}>
                    <Row className={"sidebarlink"}>
                        <Col xs={1}>
                            <Icon.Search/>
                        </Col>
                        <Col>
                            <Link className={""} to={"/catalog"}><h6>Catalog</h6></Link>
                        </Col>
                    </Row>
                </Hoverable>
                <Hoverable color={"black"}>
                    <Row className={"sidebarlink"}>
                        <Col xs={1}>
                            <Icon.Folder/>
                        </Col>
                        <Col>
                            <Link className={""} to={"/datasets"}><h6>My Datasets</h6></Link>
                        </Col>
                    </Row>
                </Hoverable>
                <Hoverable color={"black"}>
                    <Row className={"sidebarlink"}>
                        <Col xs={1}>
                            <Icon.FileCode/>
                        </Col>
                        <Col>
                            <Link className={""} to={"/projects"}><h6>My Projects</h6></Link>
                        </Col>
                    </Row>
                </Hoverable>
                <Hoverable color={"black"}>
                    <Row className={"sidebarlink"}>
                        <Col xs={1}>
                            <Icon.Cloud/>
                        </Col>
                        <Col>
                            <Link className={""} to={"/environments"}><h6>My Environments</h6></Link>
                        </Col>
                    </Row>
                </Hoverable>

                {/**
                <Hoverable color={"black"}>
                    <Row className={"sidebarlink"}>
                        <Col xs={1}>
                            <Icon.Bell/>
                        </Col>
                        <Col>
                            <Link className={""} to={"/notifications"}><h6>Notifications</h6></Link>
                        </Col>
                    </Row>
                </Hoverable>
                 **/}

                {/**}
                <Hoverable color={"black"}>
                    <Row className={"sidebarlink"}>
                        <Col xs={1}>
                            <Icon.People/>
                        </Col>
                        <Col>
                            <Link className={""} to={"/teams"}><h6>My Teams</h6></Link>
                        </Col>
                    </Row>
                </Hoverable>
                 **/}
                <Hoverable color={"black"}>
                    <Row className={"sidebarlink"}>
                        <Col xs={1}>
                            <Icon.ArrowRepeat/>
                        </Col>
                        <Col>
                            <Link className={""} to={"/sqlpipelines"}><h6>My Data Pipelines</h6></Link>
                        </Col>
                    </Row>
                </Hoverable>

                <Hoverable color={"black"}>
                    <Row className={"sidebarlink"}>
                        <Col xs={1}>
                            <Icon.ClipboardData/>
                        </Col>
                        <Col>
                            <Link className={""} to={"/dashboards"}><h6>My Dashboards</h6></Link>
                        </Col>
                    </Row>
                </Hoverable>

                <Hoverable color={"black"}>
                    <Row className={"sidebarlink"}>
                        <Col xs={1}>
                            <Icon.House/>
                        </Col>
                        <Col>
                            <Link className={""} to={"/organizations"}><h6>My Organizations</h6></Link>
                        </Col>
                    </Row>
                </Hoverable>
                <If condition={isTenantAdmin}>
                    <Then>
                        <Hoverable color={"black"}>
                            <Row className={"mt-5 sidebarlink"}>
                                <Col xs={1}>
                                    <Icon.PersonCheck/>
                                </Col>
                                <Col>
                                    <Link className={""} to={"/tenant-administrators"}><h6>Tenant Administrators</h6></Link>
                                </Col>
                            </Row>
                        </Hoverable>

                    </Then>

                </If>
            </Container>
        ) : (
            <Container>
                <Row>
                    <Col xs={9}/>
                    <Col xs={2} className={"text-left "} >
                        <Zoom color={"black"}>
                            <Icon.ArrowBarRight size={28} onClick={props.close}/>
                        </Zoom>
                    </Col>
                </Row>
            </Container>

        )}
    </SidebarStyled>
}

export default Sidebar
