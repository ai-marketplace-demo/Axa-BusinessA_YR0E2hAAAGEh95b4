import React ,{useState, useEffect} from "react";
import {Container,Row, Col, Badge,ListGroupItem,ListGroup,Dropdown,Table,Card} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import Zoom from "../../components/Zoomer/Zoom";
import Tag from "../../components/Tag/Tag";
import styled from "styled-components";
import Avatar from "react-avatar";
import UserProfileLink  from "../../views/Profile/UserProfileLink";
import ActionButton from "../../components/ActionButton/ActionButton";
import { Sparklines,SparklinesBars } from 'react-sparklines';
import {BrowserRouter, Route,Link, Switch} from "react-router-dom";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
import UserProfile from "../Profile/UserProfile";
import BasicCard from "../../components/Card/BasicCard";
dayjs.extend(relativeTime)



const  TopicBadge = styled.div`
font-size: 14px;
text-align: center;
width:13ch;
margin-left: 1px;
border-radius: 5px;
background-color: lightgrey;
color: #282c34;
`
const Styled=styled.div`
transition: transform 0.3s ease-in-out;
&:hover{
  transform: translateY(-5px);
  box-shadow: 0px 3px 2px lightgrey;
}
height:17rem;
margin-top: 7px;
padding: 1em;
border : 1px solid gainsboro;
border-radius: 8px;

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
    let    [regions, setRegions] =useState([

        { label:'US East (Ohio)', value:'us-east-2'},
        { label:'US East (N. Virginia)', value:'us-east-1'},
        { label:'US West (N. California)', value:'us-west-1'},
        { label:'US West (Oregon)', value:'us-west-2'},
        { label:'Africa (Cape Town)', value:'af-south-1'},
        { label:'Asia Pacific (Hong Kong)', value:'ap-east-1'},
        { label:'Asia Pacific (Mumbai)', value:'ap-south-1'},
        { label:'Asia Pacific (Osaka-Local)', value:'ap-northeast-3'},
        { label:'Asia Pacific (Seoul)', value:'ap-northeast-2'},
        { label:'Asia Pacific (Singapore)', value:'ap-southeast-1'},
        { label:'Asia Pacific (Sydney)', value:'ap-southeast-2'},
        { label:'Asia Pacific (Tokyo)', value:'ap-northeast-1'},
        { label:'Canada (Central)', value:'ca-central-1'},
        { label:'China (Beijing)', value:'cn-north-1'},
        { label:'China (Ningxia)', value:'cn-northwest-1'},
        { label:'Europe (Frankfurt)', value:'eu-central-1'},
        { label:'Europe (Ireland)', value:'eu-west-1'},
        { label:'Europe (London)', value:'eu-west-2'},
        { label:'Europe (Milan)', value:'eu-south-1'},
        { label:'Europe (Paris)', value:'eu-west-3'},
        { label:'Europe (Stockholm)', value:'eu-north-1'},
        { label:'Middle East (Bahrain)', value:'me-south-1'},
        { label:'South America (São Paulo)', value:'sa-east-1'},
        { label:'AWS GovCloud (US-East)', value:'us-gov-east-1'},
        { label:'AWS GovCloud (US)', value:'us-gov-west-1'},
    ]);
    const dataset=props.dataset;
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
        <Row className={``}>
            <Col xs={6}>
                <Link to={`/dataset/${props.dataset.datasetUri}/overview`}>
                    <p>
                        <Avatar className={`mr-1`} size={32} round={true} name={props.dataset.label}/> <b className={"text-capitalize"}>{props.dataset.label}</b>
                    </p>
                </Link>
            </Col>
            <Col xs={3}>
                <Row><Col xs={12}><small>{regions.find((r)=>{return r.value==props.dataset.region}).label}</small></Col></Row>
            </Col>
            <Col xs={3}>
                <small>in Org:<b> {props.dataset.organization.label}</b></small>
            </Col>
        </Row>
        <Row className={`mt-2`}>
            <Col xs={8}>
                <small>
                    {props.dataset.description.slice(0,200)}
                </small>
            </Col>
        </Row>

        <Row>
            <Col xs={12}>
                Created by <UserProfileLink username={props.dataset.owner}/>                 {dayjs(props.dataset.created).fromNow()}

            </Col>
            <Col xs={4}>
            </Col>

        </Row>
        <Row>
            <Col xs={2}>
                <Icon.PersonCheck size={22}/>
            </Col>
            <Col xs={8}>
                {props.dataset.userRoleForDataset}
            </Col>
        </Row>
        <Row>
            <Col xs={2}>
                <Icon.People size={22}/>
            </Col>
            <Col xs={8}>
                {props.dataset.SamlAdminGroupName}
            </Col>
        </Row>

        <Row>
            <Col xs={2}>
                <Icon.Table/>
            </Col>
            <Col xs={4}>
                <Link className={`text-primary`}
                      to={{
                          pathname:`/dataset/${props.dataset.datasetUri}/tables`,
                          state:{dataset:props.dataset}
                      }}>
                    <small>
                        {props.dataset.statistics.tables} Tables
                    </small>
                </Link>
            </Col>
        </Row>
        <Row>
            <Col xs={2}>
                <Icon.Folder/>
            </Col>
            <Col xs={4}>
                <Link className={`text-primary`}
                      to={{
                          pathname:`/dataset/${props.dataset.datasetUri}/locations`,
                          state:{dataset:props.dataset}
                      }}>
                    <small> {props.dataset.statistics.locations} Folders</small>
                </Link>
            </Col>
        </Row>
        <Row className={`mt-2 border-top mb-2`}>
            <Col className={`mt-2`} xs={8}>
                {
                    props.dataset.topics.map((topic)=>{
                        return <Badge className={`ml-1 p-2`} pill variant={`primary`}> {topic}</Badge>
                    })
                }
            </Col>
        </Row>


    </Styled>


}


export default DatasetListItem;

