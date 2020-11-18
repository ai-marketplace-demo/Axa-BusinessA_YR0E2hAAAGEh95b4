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




const Header=(props)=>{
    return <Row>
        <Col xs={10}>
            <Link to={`/dataset/${props.dataset.datasetUri}/overview`}>
                <b className={"text-capitalize"}>{props.dataset.label}</b>
            </Link>
        </Col>
    </Row>
}
const Body=(props)=>{
    return <div className={`mt-3`}>
        <Row>
            <Col xs={2}>
                <Icon.House size={18}/>
            </Col>
            <Col xs={8}>
                <small><b>{props.dataset.organization.label.toUpperCase()}</b></small>
            </Col>
        </Row>
        <Row>
            <Col xs={2}>
                <Icon.Cloud size={18}/>
            </Col>
            <Col xs={10}>
                <small>{props.dataset.environment.label}({props.dataset.environment.AwsAccountId}/{props.dataset.environment.region})</small>
            </Col>
        </Row>
        <Row>
            <Col xs={2}>
                <Icon.PersonCheck size={18}/>
            </Col>
            <Col xs={8}>
                <Badge pill className={`pb-1 text-white bg-info`}>
                    {props.dataset.userRoleForDataset}
                </Badge>
            </Col>
        </Row>
        <Row>
            <Col xs={2}>
                <Icon.People size={18}/>
            </Col>
            <Col xs={8}>
                <small>{props.dataset.SamlAdminGroupName}</small>
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
    </div>

}

const DatasetListItem = (props)=> {
    let [regions, setRegions] = useState([
        {label: 'US East (Ohio)', value: 'us-east-2'},
        {label: 'US East (N. Virginia)', value: 'us-east-1'},
        {label: 'US West (N. California)', value: 'us-west-1'},
        {label: 'US West (Oregon)', value: 'us-west-2'},
        {label: 'Africa (Cape Town)', value: 'af-south-1'},
        {label: 'Asia Pacific (Hong Kong)', value: 'ap-east-1'},
        {label: 'Asia Pacific (Mumbai)', value: 'ap-south-1'},
        {label: 'Asia Pacific (Osaka-Local)', value: 'ap-northeast-3'},
        {label: 'Asia Pacific (Seoul)', value: 'ap-northeast-2'},
        {label: 'Asia Pacific (Singapore)', value: 'ap-southeast-1'},
        {label: 'Asia Pacific (Sydney)', value: 'ap-southeast-2'},
        {label: 'Asia Pacific (Tokyo)', value: 'ap-northeast-1'},
        {label: 'Canada (Central)', value: 'ca-central-1'},
        {label: 'China (Beijing)', value: 'cn-north-1'},
        {label: 'China (Ningxia)', value: 'cn-northwest-1'},
        {label: 'Europe (Frankfurt)', value: 'eu-central-1'},
        {label: 'Europe (Ireland)', value: 'eu-west-1'},
        {label: 'Europe (London)', value: 'eu-west-2'},
        {label: 'Europe (Milan)', value: 'eu-south-1'},
        {label: 'Europe (Paris)', value: 'eu-west-3'},
        {label: 'Europe (Stockholm)', value: 'eu-north-1'},
        {label: 'Middle East (Bahrain)', value: 'me-south-1'},
        {label: 'South America (São Paulo)', value: 'sa-east-1'},
        {label: 'AWS GovCloud (US-East)', value: 'us-gov-east-1'},
        {label: 'AWS GovCloud (US)', value: 'us-gov-west-1'},
    ]);
    const dataset = props.dataset;
    let [isHovered, setHovered] = useState(false);
    let [menuState, setMenu] = useState({
        visibility: "hidden",
        zIndex: 0
    })
    const toggle = (state) => {
        console.log("hovered");
        setHovered(state)
    }


    const header = <Header regions={regions} {...props}/>
    const body = <Body {...props}/>

    return <BasicCard
        label={dataset.label}
        tags={dataset.tags || []}
        owner={dataset.owner}
        header={header}
        body={body}
        created={dataset.created}
        description={dataset.description}
    />
}

export default DatasetListItem;

