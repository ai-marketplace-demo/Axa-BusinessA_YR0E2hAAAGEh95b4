import React, {useState, useEffect} from "react";
import {Container, Row, Col,Spinner,Badge, Form} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import {BrowserRouter, Route,Link, Switch} from "react-router-dom";
import styled from "styled-components";
import Avatar from "react-avatar"
import Zoom from "../../components/Zoomer/Zoom"
import FacetGroups from "./FacetGroups";
import Hits from "./Hits";
import useClient from "../../api/client";
import searchDatasets from "../../api/Catalog/searchDatasets";
import Pager from "../../components/Pager/Pager";



const Catalog = ()=>{

    let client =useClient();
    let [hits,setHits]= useState({page:1,pageSize:5, pages:1,count:0, hasNext:false, hasPrevious:false, nodes:[]})
    let [facets, setFacets]= useState({});
    let [search, setSearch] = useState();
    let [filters, setFilters]=useState({})
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState(null);


    const handleInputChange=(e)=>{
        setSearch(e.target.value);
    }
    const handleKeyDown=async (e)=>{
        if (e.key === 'Enter') {
            if (hits.page>1){
                setHits({...hits, page:1})
            }else {
                fetchItems();
            }
        }
    }

    const toGraphQLFilter=()=>{
        const FacetFilters=[];
        Object.keys(filters).forEach((group)=>{
            const FacetFilter= {
                group : group,
                values: Object.keys(filters[group]).filter((v)=>{ return filters[group][v]}).map((v)=>{return v})
            }
            FacetFilters.push(FacetFilter)
        });
        return {filters:FacetFilters};
    }
    const toggleFilter=(dimensionName, value)=>{
        console.log("toggleFilter", dimensionName, value);
        if (filters[dimensionName]){
            if (filters[dimensionName][value]){
                filters[dimensionName][value]=!filters[dimensionName][value]
            }else {
                filters[dimensionName][value]=true
            }
        }else {
            filters[dimensionName]={[value]:true}
        }
        setFilters({...filters});

    }
    const resetFilters=async ()=>{
        setFilters({});
        if(hits.page==1){
            await fetchItems()
            return;
        }
        setHits({...hits, page:1})

    }

    const applyFilters=async ()=>{
        if(hits.page==1){
            await fetchItems()
            return;
        }
        setHits({...hits, page:1});

    }

    const nextPage=async ()=>{
        if (hits.hasNext){
            await setHits({...hits, page:hits.page+1});
        }
    }


    const previousPage=async  ()=>{
        if (hits.hasPrevious){
            setHits({...hits, page:hits.page-1});
            await fetchItems()
        }
    }

    const fetchItems = async ()=>{
        const query = searchDatasets({
            filters: toGraphQLFilter(),
            page :hits.page,
            pageSize:hits.pageSize,
            term : search
        })
        setLoading(true);
        const response= await client.query(query);
        if (!response.errors){
            setHits(response.data.searchDatasets.hits);
            setFacets(response.data.searchDatasets.facets);
            setLoading(false);

        }else{
            setError(`Unexpected error, received ${response.errors[0].message}`);
            setLoading(false);
        }
    }


    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client,hits.page]);

    return <Container>
        <Row className={`mt-4`}>
            <Col xs={8}>
                <h3> <Icon.FolderSymlink/> Data Catalog </h3>
            </Col>
            {/**
            <Col xs={8} className={`mt-2 text-right`}>
                <Row>
                    <Col xs={3}><i>Found {hits.count} results</i></Col>
                    <Col onClick={previousPage} className={`text-center`} xs={1}><Icon.ChevronLeft/></Col>
                    <Col className={`text-center`} xs={3}>Page {hits.page}/{hits.pages}</Col>
                    <Col onClick={nextPage} className={`text-center`}  xs={1}><Icon.ChevronRight/></Col>
                </Row>
            </Col>
             **/}
        </Row>
        <Row>
            <Col xs={12}>
                <Pager
                    page={hits.page}
                    pages={hits.pages}
                    count={hits.count}
                    next={nextPage}
                    prev={previousPage}
                    onKeyDown={handleKeyDown}
                    onChange={handleInputChange}
                />
            </Col>
        </Row>
        {/**
        <Row className={`mt-2`}>
            <Col xs={11}>
                <input
                    className={`form-control`}
                    onKeyDown={handleKeyDown}
                    value={search}
                    onChange={handleInputChange}
                    style={{width:'100%'}}  placeholder={`Search all datasets`}/>
            </Col>
        </Row>
         **/}
        {(loading)?(
            <Row className={`mt-3`}>
                <Col xs={3}>
                    <Spinner size={"lg"} variant={`primary`} animation={`border`}/>
                </Col>
            </Row>

        ):(
            (error)?(
                <Row className={`mt-3`}>
                    <Col xs={3}>
                        {error}
                    </Col>
                </Row>

            ):(
                <Row className={`mt-3`}>
                    <Col xs={3}>
                        <Row>
                            <Col onClick={applyFilters} className={`text-primary`} xs={4}>
                                <Zoom color={`blue`} scale={1.1}>
                                    apply
                                </Zoom>
                            </Col>
                            <Col onClick={resetFilters} className={`text-info`} xs={4}>
                                <Zoom color={`blue`} scale={1.1}>
                                    reset
                                </Zoom>
                            </Col>
                        </Row>
                        <Row className={`mt-2`}>
                            <Col xs={12}>
                                <FacetGroups
                                    toggleFilter={toggleFilter}
                                    filters={filters}
                                    groups={facets.groups}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col className={``} xs={9}>
                        <Hits hits={hits}/>
                    </Col>
                </Row>
            )


            )}
        <Row>
            <div style={{height:'200px'}}/>
        </Row>

    </Container>
}



export default  Catalog
