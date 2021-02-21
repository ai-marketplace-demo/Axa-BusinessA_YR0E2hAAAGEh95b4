import React  ,{useState} from "react";
import {If,Then,Else} from "react-if";
import {Container,Row,Col,Table} from "react-bootstrap";
import UserProfileLink from "../../Profile/UserProfileLink";
import dayjs from "dayjs";
import {AwsRegions as regions} from "../../../components/AwsRegions/AwsRegionsData";
import EasyEdit, {Types} from "react-easy-edit";
import Select from "react-select";
import Tag from "../../../components/Tag/Tag";
import ReactTagInput from "@pathofdev/react-tag-input";


const Metadata  =(props)=>{
    const canEdit=props.canEdit;
    return <Row className={`mt-2`}>
        <Col xs={12}>
            <Table hover size="sm">
                <tbody>

                <tr>
                    <td>
                        Language
                    </td>
                    <td>
                        <If condition={props.canEdit}>
                            <Then>
                                <Select options={props.Languages} value={props.language} onChange={props.selectLanguage}/>
                            </Then>
                            <Else>
                                {props.dataset.language}
                            </Else>
                        </If>
                    </td>
                </tr>
                <tr>
                    <td>
                        Security Classification
                    </td>
                    <td>
                        <If condition={canEdit}>
                            <Then>
                                <Select options={props.Classifications} value={props.confidentiality} onChange={props.selectClass}/>
                            </Then>
                            <Else>
                                {props.dataset.confidentiality}
                            </Else>
                        </If>
                    </td>
                </tr>
                <tr>
                    <td>
                        Topics
                    </td>
                    <td>
                        <If condition={props.canEdit}>
                            <Then>
                                <Select
                                    isMulti
                                    onChange={props.selectTopic}
                                    value={props.topics}
                                    options={props.Topics}/>
                            </Then>
                            <Else>
                                {props.dataset.topics.map((t)=>{
                                    return <Tag tag={t}/>
                                })}
                            </Else>
                        </If>
                    </td>
                </tr>
                <tr>
                    <td>
                        Tags
                    </td>
                    <td>
                        <If condition={props.canEdit}>
                            <Then>
                                <ReactTagInput
                                    tags={props.tags}
                                    onChange={props.setTags}
                                />
                            </Then>
                            <Else>
                                {
                                    props.dataset.tags.map((t)=>{
                                        return <Tag tag={t}/>

                                    })
                                }
                            </Else>
                        </If>
                    </td>
                </tr>
                </tbody>
            </Table>
        </Col>
    </Row>
}

export default Metadata
