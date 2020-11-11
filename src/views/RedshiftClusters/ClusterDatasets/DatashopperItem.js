import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import Avatar from "react-avatar";
import Tag from "../../../components/Tag/Tag";
import {toast} from "react-toastify";
import useClient from "../../../api/client";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const Styled=styled.div`
transition: transform 0.3s ease-in-out;
&:hover{
  transform: translateY(-5px);
  box-shadow: 0px 3px 2px lightgrey;
}
height:17rem;
margin-top: 7px;
margin-right: 3px;
padding: 1ch;
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



const DatashopperItem = (props)=>{

    const linkDataset=()=>{
        props.linkDataset&&props.linkDataset(props.dataset.datasetUri);
    };

    const unlinkDataset=()=>{
        props.unlinkDataset&&props.unlinkDataset(props.dataset.datasetUri);
    }

    return <Styled>
        <Row>
            <Col xs={12}>
                ==>{props.dataset.redshiftClusterPermission}
            </Col>
        </Row>
        <Row>
            <Col xs={8}>
                <Link state={{
                    dataset : props.dataset
                }}
                      to={`/dataset/${props.dataset.datasetUri}/overview`}>
                    <p>
                        <Avatar className={`mr-1`} size={32} round={true} name={props.dataset.label}/> <b className={"text-capitalize"}>{props.dataset.label}</b>
                    </p>
                </Link>
            </Col>
            <Col xs={4}>
                {
                    (['NoPermission','Visible'].indexOf(props.dataset.userRoleForDataset)!=-1)?(
                        <div>
                            <Spinner size={`sm`} animation={`grow`} variant={`danger`}/>
                        </div>

                    ):(
                       <div/>
                    )
                }
            </Col>
        </Row>
        <Row>
            <Col xs={8}/>
            <Col xs={4}>
                <small>in Org:<b> {props.dataset.organization.label}</b></small>
            </Col>
        </Row>
        <Row>
            <Col xs={8}>
                Created by {props.dataset.owner} {dayjs(props.dataset.created).fromNow()}
            </Col>
            <Col xs={4}>
                <Tag tag={props.dataset.userRoleForDataset}/>

            </Col>
        </Row>

        <Row className={`mt-2`}>
            <Col xs={6}>
                <Link className={`text-dark`}
                      to={{
                          pathname:`/dataset/${props.dataset.datasetUri}/locations`,
                          state:{dataset:props.dataset}
                      }}>
                    <small><Icon.Folder size={18}/>{props.dataset.statistics.locations} locations</small>
                </Link>
            </Col>


            <Col xs={6}>
                <Link className={`text-dark`}
                      to={{
                          pathname:`/dataset/${props.dataset.datasetUri}/tables`,
                          state:{dataset:props.dataset}
                      }}>
                    <small> <Icon.Table size={18}/>  {props.dataset.statistics.tables} tables</small>
                </Link>
            </Col>
        </Row>
        <Row className={`mt-2`}>
            <Col xs={8}>
                <small>
                    {props.dataset.description.slice(0,200)}
                    <Link className={`text-primary`}
                          to={{
                              pathname:`/dataset/${props.dataset.datasetUri}/overview`,
                              state:{dataset:props.dataset}
                          }}>
                        {`    see more`}
                    </Link>
                </small>
            </Col>
        </Row>
        <Row>
            <Col xs={8}>
            {props.dataset.tags.filter((t,index)=>{ return index <=2}).map((t)=>{
                return <Tag tag={t}/>
            })}
            </Col>
            <Col xs={2}>
                {
                    (props.linkDataset)?(
                        <div onClick={linkDataset} className={"btn btn-primary btn-sm"}>
                            Link
                        </div>
                    ):(
                        (props.unlinkDataset)?(
                            <div onClick={unlinkDataset} className={"btn btn-danger btn-sm"}>
                                Unlink
                            </div>

                        ):(
                            <div/>
                        )
                    )
                }

            </Col>
        </Row>
    </Styled>
}


export default DatashopperItem;
