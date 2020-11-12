import React, {useState, useRef,useEffect} from "react";
import {Container, Row, Col, Spinner, Badge,Table} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import RoutedTabs from "../../components/Tabs/Tabs";
import {If, Then, Else, Case, Switch, Default} from "react-if";
import useClient from "../../api/client";
import getSavedQuery from "../../api/SavedQuery/getSavedQuery";
import updateSavedQuery from "../../api/SavedQuery/updateSavedQuery";
import {Link, useParams} from "react-router-dom";

const SavedQueryView = (props)=>{


    const tabs=["info","query","chart"];
    const [tab, setTable] = useState("info")


    return <RoutedTabs tabs={tabs} current={"info"}/>
}


export default SavedQueryView;
