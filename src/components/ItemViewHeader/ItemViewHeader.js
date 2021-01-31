import React, {Component} from "react";
import {Row, Col,Badge} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import * as SiIcon from "react-icons/si";
import StackStatusBadge from "../../components/StackStatusBadge/StackStatusBadge";
import RoleBadge from "../../components/RoleBadge/RoleBadge";
import * as PropTypes from "prop-types";
import UserProfileLink from "../../views/Profile/UserProfileLink";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


class ItemViewHeader extends Component {
    render() {
        return <Row style={{
            borderBottom: "1px lightgrey solid",
            borderRight: "1 solid white",
            //borderBottomRightRadius:"23px",
            boxShadow: "0px 7px 2px rgb(0,0,0,0.04)",
        }}
                    className={"mt-3    "}>
            <Col className="pt-4" xs={1}>
                {this.props.itemIcon}
            </Col>
            <Col className={`border-right pt-3`} xs={4}>
                <Row>
                    <h4>{this.props.label}</h4>
                </Row>
                <Row>
                    <p>Created by <UserProfileLink username={this.props.owner}/> {dayjs(this.props.created).fromNow()}</p>
                </Row>

            </Col>
            {( this.props.role &&
                <Col className={`border-right pt-3`} xs={2}>
                    <div><Icon.PersonCheck/><span className={"ml-1"}>Role</span></div>
                    <div className={"ml-2"}><RoleBadge role={this.props.role}/></div>
                </Col>
            )}
            {( this.props.status &&
                <Col className={`border-right pt-3`} xs={2}>
                    <div><SiIcon.SiAmazonaws/><span className={"ml-1"}>Status</span></div>
                    <div className={"ml-2"}><StackStatusBadge status={this.props.status}/></div>
                </Col>
            )}
            {( this.props.region &&
                <Col className={`border-right pt-3`} xs={2}>
                    <div><Icon.Globe/><span className={"ml-1"}>Region</span></div>
                    <div className={"ml-2"}>
                        <Badge pill variant={`primary`}>
                            {this.props.region}
                        </Badge>
                    </div>
                </Col>
            )}
        </Row>;
    }
}

ItemViewHeader.propTypes = {info: PropTypes.shape({})};
export default ItemViewHeader;
