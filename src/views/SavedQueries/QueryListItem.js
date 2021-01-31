import React from "react";
import {Row, Col, Badge} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import BasicCard  from "../../components/Card/BasicCard";
import {Link} from "react-router-dom";



const Body=(props)=>{
    return <div className={`mt-3`}>
        <Row>
            <Col xs={2}>
                <Icon.PersonCheck size={18}/>
            </Col>
            <Col xs={8}>
                <Badge pill className={`text-white bg-primary`}>
                    {props.query.userRoleForScheduledQuery}
                </Badge>
            </Col>
        </Row>
        <Row>
            <Col xs={2}>
                <Icon.House size={18}/>
            </Col>
            <Col xs={8}>
                <small>{props.query.organization.name}</small>
            </Col>
        </Row>
        <Row>
            <Col xs={2}>
                <Icon.Cloud size={18}/>
            </Col>
            <Col xs={8}>
                <small>{props.query.environment.name}({props.query.environment.AwsAccountId})</small>
            </Col>
        </Row>
        <Row>
            <Col xs={2}>
                <Icon.Globe size={18}/>
            </Col>
            <Col xs={8}>
                <small>{props.query.environment.region}</small>
            </Col>
        </Row>
    </div>

}
const Header = (props)=>{
    return <Row>
        <Col xs={8}>
            <Link to={`/query/${props.query.scheduledQueryUri}/overview`}>
                <b className={"text-capitalize"}>{props.query.label}</b>
            </Link>
        </Col>
    </Row>
}

const QueryListItem = (props)=>{

    const body=<Body {...props}/>
    const header = <Header  {...props}/>
    return <BasicCard
        label={props.query.label}
        owner={props.query.owner}
        created={props.query.created}
        description={props.query.description}
        body={body}
        header={header}
        tags={props.query.tags||[]}
        topics={props.query.topics||[]}
    />

}


export default QueryListItem;
