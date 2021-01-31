import React, {useState, useEffect} from "react";
import {Container, Row, Col} from "react-bootstrap";
import * as SiIcon from "react-icons/si";
import RoutedTabs from "../../components/Tabs/Tabs";
import {If, Then, Else, Case, Switch, Default} from "react-if";
import useClient from "../../api/client";
import {toast} from "react-toastify";
import {Link, useParams} from "react-router-dom";
import ItemViewHeader from "../../components/ItemViewHeader/ItemViewHeader";
import NotebookOverview from "./NotebookOverview";
import Loader from "react-loaders";
import getNotebook from "../../api/SagemakerNotebook/getSagemakerNotebook";


const NotebookAdmin = (props)=>{
    const params = useParams();
    const client = useClient();
    const [notebook, setNotebook] = useState({
        name:'',
        label:''
    });

    const [ready,setReady] = useState(false);

    const fetchNotebook = async()=>{
        setReady(false);
        const response = await client.query(getNotebook(params.uri));
        if (!response.errors){
            setNotebook({...response.data.getSagemakerNotebook})
        }else {
            toast(`Could not retrieve notebook, received ${response.errors[0].message}`)
        }
        setReady(true);
    };

    useEffect(()=>{
        if (client){
            fetchNotebook();
        }
    },[client]);

    const tabs= ["overview"];

    if (!ready){
        return <Container>
            <Row>
                <Col style={{marginTop: '24%', marginLeft:'43%'}} xs={4}>
                    <Loader color={`lightblue`} type="ball-scale-multiple" />
                </Col>
            </Row>
        </Container>
    }
    return <Container className={`mt-4`} fluid>
        <ItemViewHeader
            label={notebook.label}
            owner={notebook.owner}
            role={notebook.userRoleForProjectNotebook}
            region={notebook.environment.region}
            status={notebook.stack ? notebook.stack.status : "Ready"}
            created={notebook.created}
            itemIcon={<SiIcon.SiJupyter size={32}/>}
        />

        <Row className={`mt-4`}>
            <Col xs={12}>
                <RoutedTabs tabs={tabs}></RoutedTabs>
            </Col>
        </Row>
        <Row>

            <Col xs={12}>
                <Switch>
                    <Case condition={params.tab=="overview"}>
                        <If condition={ready}>
                            <Then>
                                <NotebookOverview notebook={notebook}/>
                            </Then>
                            <Else>

                            </Else>
                        </If>
                    </Case>
                    <Default>
                        {params.tab}
                    </Default>
                </Switch>
            </Col>
        </Row>
    </Container>
};


export default NotebookAdmin;
