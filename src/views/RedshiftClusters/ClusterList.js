import React ,{useEffect,useState} from "react";
import {Col, Row, Container, Spinner} from "react-bootstrap";
import {If, Then, Else} from "react-if";
import * as Icon from  "react-bootstrap-icons";
import styled from "styled-components";
import MainActionButton from "../../components/MainActionButton/MainButton";
import {Link} from "react-router-dom";
import useClient from "../../api/client";
import {toast} from "react-toastify";
import searchRedshiftClusters from "../../api/RedshiftCluster/searchClusters";
import RedshiftClusterListItem from "./ClusterListItem";

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
    if (!ready) {
        return <Col>
            <Spinner variant={"primary"} animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </Col>

    }
    return <Styled>
        <Container className={""}>
            <Row>
                <Col xs={4}>
                    <h3> <Icon.Server/> My Data Warehouses</h3>
                </Col>
                <Col xs={6}>
                    <Row>
                        <Col xs={4}><i>Found {clusters.count} results</i></Col>
                        <Col xs={6}>
                            <Row>
                                <Col className={`pt-2 text-right`} onClick={prevPage} xs={1}>
                                    <Icon.ChevronLeft/>
                                </Col>
                                <Col className={`text-center`} xs={5}>
                                    Page {clusters.page}/{clusters.pages}
                                </Col>
                                <Col className={`pt-2 text-left`}  onClick={nextPage} xs={1}>
                                    <Icon.ChevronRight/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs={1} className={`mt-2`}>
                    <MainActionButton>
                        <Link to={"/newredshiftcluster"}>
                            Create
                        </Link>
                    </MainActionButton>
                </Col>
            </Row>
            <Row className={"mt-3"}>
                <Col className={`pt-2`} xs={12}>
                    <input className={`form-control`} onKeyDown={handleKeyDown} value={term} onChange={handleInputChange} style={{width:"100%"}}/>
                </Col>
            </Row>

            <Row className={`mt-3`}>
                <If condition={clusters.count}>
                    <Then>
                        {
                            clusters.nodes.map((cluster)=>{
                                return <Col xs={5}>
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
        </Container>
    </Styled>

};


export default RedshiftClusterList;
