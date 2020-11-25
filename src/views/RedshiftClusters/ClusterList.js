import React ,{useEffect,useState} from "react";
import {Col, Row, Container, Spinner} from "react-bootstrap";
import {If, Then, Else} from "react-if";
import * as Icon from  "react-bootstrap-icons";
import * as FiIcon from "react-icons/fi";
import styled from "styled-components";
import MainActionButton from "../../components/MainActionButton/MainButton";
import {Link} from "react-router-dom";
import useClient from "../../api/client";
import {toast} from "react-toastify";
import searchRedshiftClusters from "../../api/RedshiftCluster/searchClusters";
import RedshiftClusterListItem from "./ClusterListItem";
import Pager from "../../components/Pager/Pager";

const Styled=styled.div`
height:100vh;
`;


const RedshiftClusterList = function(){
    const client = useClient();

    const [clusters, setClusters] =useState({
        count:  0,
        page : 1,
        pages:1,
        hasNext:false,
        hasPrevious : false,
        nodes:[]
    });
    let [ready, setReady] = useState(false);

    let [term, setTerm] = useState(null);

    const handleInputChange=(e)=>{
        setTerm(e.target.value);
        setClusters({...clusters,page:1})
    };


    const handleKeyDown = async (e)=>{
        if (e.key === 'Enter') {
            setClusters({...clusters,page:1});
            await fetchItems()
        }
    };
    const nextPage=()=>{
        if(clusters.hasNext){
            setClusters({...clusters,page:clusters.page+1})
        }
    };
    const prevPage=()=>{
        if(clusters.hasPrevious){
            setClusters({...clusters,page:clusters.page-1})
        }

    };

    const fetchItems= async()=>{
        setReady(false);
        const response = await client.query(
            searchRedshiftClusters({
                    term,
                    page:clusters.page,
                    pageSize:10
                })
        );
        if (!response.errors){
            setClusters(response.data.searchRedshiftClusters);
        }else {
            toast(`Received ${response.errors[0].message}`);
        }
        setReady(true);
    };

    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client, clusters.page]);

    return <Styled>
        <Container fluid className={"mt-4"}>

            <Row>
                <Col xs={6}>
                    <h3> <FiIcon.FiBox/><span className={'ml-1'}>Warehouses</span></h3>
                </Col>
                <Col xs={2}/>

                <Col xs={2} className={`mt-2`}>
                    <Link to={`/importredshiftcluster`}>
                        <div style={{width:'100%'}} className={`rounded-pill btn-sm btn btn-info`}>Import</div>
                    </Link>
                </Col>

                <Col xs={2} className={`mt-2`}>
                    <Link to={`/newredshiftcluster`}>
                        <div style={{width:'100%'}} className={`btn btn-sm btn-success rounded-pill`}>Create</div>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Pager
                        label={`clusters(s)`}
                        count={clusters.count}
                        page={clusters.page}
                        pages={clusters.pages}
                        next={nextPage}
                        previous={prevPage}
                        onKeyDown={(e)=> {handleKeyDown(e)}}
                        onChange={(e)=>{handleInputChange(e)}}
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
                        <If condition={clusters.count}>
                            <Then>
                                {
                                    clusters.nodes.map((cluster)=>{
                                        return <Col xs={4}>
                                            <RedshiftClusterListItem cluster={cluster} reloadClusters={fetchItems}/>
                                        </Col>
                                    })
                                }
                            </Then>
                            <Else>
                                <Col xs={12}>
                                    <i>No Amazon Redshift clusters found. Create a new one <Link to={`/newredshiftcluster`}>Here</Link>
                                    </i>
                                </Col>
                            </Else>
                        </If>
                    </Row>
                </Else>
            </If>
        </Container>
    </Styled>

};


export default RedshiftClusterList;
