import React, {useState, useEffect} from "react";
import {Container, Row, Col, Badge, Spinner, Table} from "react-bootstrap";
import {If, Then, Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import {Link, Redirect} from "react-router-dom";
import {toast} from "react-toastify";
import Pager from "../../components/Pager/Pager";
import BasicCard  from "../../components/Card/BasicCard";
import QueryListItem from "./QueryListItem";
import useClient from "../../api/client";
import listScheduledQueries  from "../../api/SavedQuery/listScheduledQueries";
import createSavedQuery from "../../api/SavedQuery/createSavedQuery";




const QueryList = (props)=>{
    const client = useClient();
    const [queries, setQueries] = useState({
        count: 0,
        page: 1,
        pages:1,
        hasNext: false,
        hasPrevious : false,
        nodes:[

        ]
    });
    const [ready, setReady] = useState(false);

    const [newQueryUri, setNewQueryUri] = useState(null);

    const fetchItems=async ()=>{
        setReady(false);
        const response = await client.query(listScheduledQueries());
        if (!response.errors){
            setQueries({...response.data.listScheduledQueries});
        }else {
            toast(`Could not retrieve queries, received ${response.errors[0].message}`)
        }
        setReady(true);

    }

    const createNewQuery=async()=>{
        const response = await client.mutate(createSavedQuery({
            input: {
                label :"Untitled",
                description :"No description"
            }
        }));
        if (!response.errors){
            toast(`Got new query ${response.data.createSavedQuery.savedQueryUri}`)
            setNewQueryUri(response.data.createSavedQuery.savedQueryUri);
        }else {
            toast(`Could not create query, received ${response.errors[0].message}`)
        }
    }
    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client])

    return <Container fluid className={`mt-4`}>
        <Row>
            <Col xs={10}>
                <h3><Icon.Terminal/> My Queries</h3>
            </Col>
            <Col xs={2}>
                <Link to={`/new-scheduled-query`}>
                <div  className={`btn btn-info btn-sm rounded-pill`}>
                    Create
                </div>
                </Link>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <Pager
                label={`queries`}
                count={queries.count}
                page={queries.page}
                pages={queries.pages}
                next={()=>{}}
                previous={()=>{}}

                />

            </Col>
        </Row>
        <If condition={!ready}>
            <Then>
                <Spinner variant={`primary`} animation={`border`} />
            </Then>
            <Else>
                <Row className={`mt-3`}>

                    {
                        queries.nodes.map((q)=>{

                            return <Col xs={4}>
                                <QueryListItem query={q}/>
                            </Col>

                        })
                    }
                </Row>
            </Else>
        </If>

    </Container>

}


export default QueryList;
