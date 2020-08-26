import React, {useState, useEffect} from "react";
import {Container, Row, Col,Spinner,Badge, Form} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import {BrowserRouter, Route,Link, Switch} from "react-router-dom";
import styled from "styled-components";
import Avatar from "react-avatar"
import Zoom from "../../components/Zoomer/Zoom"
import FacetGroup from "./FacetGroup";



const FacetGroups = (props)=>{
    return <React.Fragment>
        {
            props.groups.map((group)=>{
                return <FacetGroup {...props}  group={group}/>
            })
        }
        </React.Fragment>

}


export default FacetGroups;
