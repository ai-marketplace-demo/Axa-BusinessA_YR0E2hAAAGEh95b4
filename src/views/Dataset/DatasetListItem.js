import React ,{useState, useEffect} from "react";
import {Container,Row, Col, Badge,ListGroupItem,ListGroup,Dropdown,Table,Card} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import Zoom from "../../components/Zoomer/Zoom";
import styled from "styled-components";
import ActionButton from "../../components/ActionButton/ActionButton";
import { Sparklines,SparklinesBars } from 'react-sparklines';
import {BrowserRouter, Route,Link, Switch} from "react-router-dom";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)


const Styled=styled.div`
transition: transform 0.3s ease-in-out;
&:hover{
  transform: translateY(-12px);
  box-shadow: 0px 5px 2px lightgrey;
}
border : 1px solid gainsboro;
border-radius: 7px;
a{
  color :black;
  outline: 0;
}
a:hover, a:link, a:visited{
  text-decoration:none;
  color :black;
}
}
`;





const DatasetListItem = (props)=>{
    let [isHovered, setHovered] = useState(false);
    let [menuState, setMenu] = useState({
        visibility: "hidden",
        zIndex:0
    })
    const toggle=(state)=>{
        console.log("hovered");
        setHovered(state)
    }

    return <Styled>
        <Container className={"p-4 mt-3"}>
        <Row className={""}>
            <Col className="" xs={2}>
                <Icon.Folder size={22}/>
            </Col>
            <Col className="" xs={6}>
                <Link className={"text-dark"} to={`/dataset/${props.dataset.datasetUri}/overview`}>
                    <h4 className={"text-secondary  text-capitalize"}>{props.dataset.label}</h4>
                </Link>
            </Col>
            <Col   className="" xs={4}>
                <Col className="text-right" xs={12}>
                    <Zoom scale={1.5} origin={"bottom right"} color={"blue"}><small>Edit</small></Zoom >
                </Col>
                <Col className="text-right" xs={12}>
                    <Zoom scale={1.5} origin={"bottom right"} color={"blue"}><small>Explore</small></Zoom >
                </Col>
            </Col>
        </Row>
            <Row>
                <Col>
                    Your Role For This Dataset : <Badge variant={`primary`}>{props.dataset.userRoleForDataset}</Badge>
                </Col>
            </Row>

        <Row>
            <Col className="  text-xs" xs={6}><small>{props.dataset.owner}</small></Col>
            <Col className=" " xs={6}><small>Created {dayjs(props.dataset.created).fromNow()}</small></Col>
        </Row>
        <Row>
            <Col xs={4}>
                <Icon.Table/> 2 Tables
            </Col>
            <Col xs={4}>
                <Icon.FileRichtext/> 2 Folders
            </Col>
        </Row>
        <Row className={"mt-3"}>
            <Col xs={12}>
                <b>{props.dataset.description}</b>
            </Col>
        </Row>
        <Row className={"mt-1"}>
            <Col xs={4}>Tagged:</Col>
            <Col xs={8}>
                {["finance","hr","prod","test"].map((tag,i)=>{
                    return <Badge key={`${tag}-${i}`} pill className="ml-1 " variant={"secondary"}>{tag}</Badge>
                })}
            </Col>
        </Row>
        <Row className={" mt-4"}>
            <Col className="" xs={4}>
                <small>bookmarks</small>
            </Col>
            <Col className="" xs={4}>
                <small>projects</small>
            </Col>
            <Col className="" xs={4}>
                <small>shares</small>

            </Col>
        </Row>
        <Row className={" mt-0"}>
            <Col className="" xs={4}>
                <b>
                <Icon.Bookmark/> 344
                </b>
            </Col>
            <Col className="" xs={4}>
                <b>
                <Icon.FileCode/> 12
                </b>
            </Col>
            <Col className="" xs={4}>
                <b>
                <Icon.Reply/> 12
                </b>

            </Col>
        </Row>


    </Container>
    </Styled>

}


export default DatasetListItem;

