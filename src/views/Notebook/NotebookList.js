import React, {useState, useEffect} from "react";
import {Container, Row, Col, Badge, Spinner, Table} from "react-bootstrap";
import {If, Then, Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import * as SiIcon from "react-icons/si";
import {Link, Redirect} from "react-router-dom";
import {toast} from "react-toastify";
import Pager from "../../components/Pager/Pager";
import BasicCard  from "../../components/Card/BasicCard";
import NotebookListItem from "./NotebookListItem";
import useClient from "../../api/client";
import listSagemakerNotebooks from "../../api/SagemakerNotebook/listSagemakerNotebooks";



const NotebookList = (props)=>{
    const client = useClient();
    const [notebooks, setNotebooks] = useState({
        count: 0,
        page: 1,
        pages:1,
        hasNext: false,
        hasPrevious : false,
        nodes:[

        ]
    });
    const [ready, setReady] = useState(false);

    const fetchItems=async ()=>{
        setReady(false);
        const response = await client.query(listSagemakerNotebooks());
        if (!response.errors){
            setNotebooks({...response.data.listSagemakerNotebooks});
        }else {
            toast(`Could not retrieve notebooks, received ${response.errors[0].message}`)
        }
        setReady(true);
    }


    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client])

    return <Container fluid className={`mt-4`}>
        <Row>
            <Col xs={10}>
                <h3><SiIcon.SiJupyter/> My Notebooks</h3>
            </Col>
            <Col xs={2}>
                <Link to={`/new-notebook`}>
                    <div className={`btn btn-info btn-sm  rounded-pill`}>
                        Create
                    </div>
                </Link>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <Pager
                    label={`notebooks`}
                    count={notebooks.count}
                    page={notebooks.page}
                    pages={notebooks.pages||1}
                    next={()=>{}}
                    previous={()=>{}}
                />

            </Col>
        </Row>
        <If condition={!ready}>
            <Then>
                <Row className={`mt-3`}>
                    <Col xs={12}>
                    <Spinner variant={`primary`} animation={`border`} />
                    </Col>
                </Row>
            </Then>
            <Else>
                <Row className={`mt-3`}>

                    {
                        notebooks.nodes.map((n)=>{

                            return <Col xs={4}>
                                <NotebookListItem client={client} notebook={n}/>
                            </Col>
                        })
                    }
                </Row>
            </Else>
        </If>

    </Container>

}


export default NotebookList;
