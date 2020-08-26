import React,{useState,useEffect} from "react";
import {Container, Row, Col,Spinner,Badge, Form} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import {BrowserRouter, Route,Link, Switch} from "react-router-dom";
import styled from "styled-components";
import Avatar from "react-avatar"
import Zoom from "../../components/Zoomer/Zoom"
import Wireframe from "../../components/Wireframe/Wireframe";
import useClient from "../../api/client";
import searchDatasets from "../../api/Catalog/searchDatasets";
import {toast} from "react-toastify";
import dayjs from "dayjs";

const FacetGroupStyled=styled.div`
__border-radius: 8px;
__border : solid 1px lightgrey;
__background-color: white;
padding-bottom: 5px;
padding : 0px;
margin-bottom: 3%;
__height: 3em;
font-size: 1.2rem;
`


const FacetGroupLine=styled.div`
padding : 0px;
margin: 0;
height:1.3em;
font-size: 0.9rem;
width:100%;


&:hover{
  background-color: lightgoldenrodyellow;
  font-weight: bolder;
}

`



const FullScreen=styled.div`
position : top;#fixed;
top : 1%;
z-index: 10;
width: 100%;
margin-left: 0%;
__border : 1px solid black;
background-color: white;
__height: 200vh;
a:link, a:visited{
    text-decoration:none;
}
a{
 outline: 0;
}
`


const HitStyled=styled.div`
transition: transform 0.3s ease-in-out;
&:hover{
  transform: translateY(-3px);
  box-shadow: 0px 3px 2px lightgrey;
}
height:10rem;
margin-top: 7px;
width:98%;
padding: 1em;
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

const FacetGroupItem = (props)=>{
    return <FacetGroupLine><Row>

            <Col xs={9}>
                <div onClick={()=>{props.toggleFilter(props.group, props.value)}}>{props.value}</div>
            </Col>
            <Col xs={2}>
                {
                    (props.filters[props.group][props.value])?(
                        <div> <Badge variant={'primary'} size={'sm'}>{props.count}</Badge></div>
                    ):(
                        <b>{props.count}</b>
                    )
                }
            </Col>

    </Row>
    </FacetGroupLine>

}


const FacetGroup=(props)=>{
    return <Row className={"ml-0 mb-2"}>
        <Col xs={12}>
            <Row className={`mt-1`}>
                <Col className="ml-0 text-left" xs={10}>
                    <b className={"text-capitalize"}>{props.dimensionName}</b>
                </Col>
            </Row>

            <Row className={"ml-0 mt-1"}>
                    {props.items.map((value, value_index)=>{
                        return <FacetGroupItem
                            select={true}
                            toggleFilter={props.toggleFilter}
                            filters={props.filters}
                            group={props.dimensionName}
                            key={`facet-group-item-${props.name}-${value_index}`}{...value}/>
                    })}
            </Row>
        </Col>
    </Row>

}
const FacetGroups = (props)=>{
    return <>
        <Row className={`ml-0`} >
            <Col className={`ml-0`} xs={4}>
                <Row>
                    <Col xs={6}>
                        <Zoom scale={'1.1'}>
                        <div
                            onClick={props.applyFilters} className={`text-primary`}>apply</div>
                        </Zoom>
                    </Col>
                    <Col xs={6}>
                        <Zoom scale={'1.1'}>
                        <div onClick={props.resetFilters} className={`text-info`}>reset</div>
                        </Zoom>
                    </Col>
                </Row>
            </Col>

        </Row>
        <Row className={`ml-0 mt-2`}>

            <Col xs={12}>
                {props.groups.map((group,group_index)=>{
                    return <FacetGroup
                            toggleFilter={props.toggleFilter}
                            filters={props.filters}
                            {...group}/>
                })}
            </Col>
    </Row>
    </>
}

const Catalog=(props)=>{
    let [ready, setReady] = useState(false);
    let [results, setResults] = useState({groups:[]});
    let [hits, setHits] = useState({});
    let [facetFilters, setFacetFilters]= useState({});
    let [search, setSearch] = useState()
    let client = useClient();


    const handleInputChange=(e)=>setSearch(e.target.value);


    const handleKeyDown=async (e)=>{
        if (e.key === 'Enter') {
            await fetchItems();
        }
    }

    const nextPage=()=>{
        if (hits.hasNext){

            setHits({...hits, page:hits.page+1})
        }
    }
    const prevPage=()=>{
        if (hits.hasPrevious){
            setHits({...hits, page:hits.page-1})
        }

    }

    const fetchItems=async ()=>{
        const gqlFilters={filters:[]}
        Object.keys(facetFilters).map((grp)=>{
            let FacetFilter={
                group:grp,
                values:[]
            }
            Object.keys(facetFilters[grp]).forEach((v)=>{
                if (facetFilters[grp][v]){
                    FacetFilter.values.push(v);
                }
            });
            gqlFilters.filters.push(FacetFilter);
        })
        const response=await client
            .query(
                searchDatasets({
                    filters:gqlFilters,
                    page: hits.page||1,
                    term:search})
            );
        if (!response.errors){
            setResults(response.data.searchDatasets.facets);
            setHits(response.data.searchDatasets.hits);
            const filters={};
            response.data.searchDatasets.facets.groups.map((grp)=>{
                filters[grp.dimensionName]={}
                grp.items.map((item)=>{
                    filters[grp.dimensionName][item.value]=false
                })
            });
            setFacetFilters({...filters})
            setReady(true);

        }else{
            toast("KO", {hideProgressBar:true})
        }

    }
    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client, ready, hits.page])

    const toggleFilter=(group, value)=>{
        facetFilters[group][value] =!facetFilters[group][value]
        setFacetFilters({...facetFilters})
    }

    const resetFilters=()=>{
        Object.keys(facetFilters).map((grp)=>{
            Object.keys(facetFilters[grp]).map((v)=>{
                facetFilters[grp][v]= false
            })
        });
        setFacetFilters({...facetFilters})
    }

    const applyFilters=async ()=>{
        await fetchItems();
    }



    return <FullScreen>
        <Container>
            <Row>
                <Col xs={3}>
                    <h3>Catalog</h3>
                </Col>
                <Col className={`ml-3 pt-2`} xs={3}>
                    <i>Found {hits.count} results</i>
                </Col>
                <Col className={`pt-2`}xs={5}>
                    <Row>
                        <Col xs={2}><Icon.ChevronLeft onClick={prevPage}/></Col>
                        <Col xs={4}>Page {hits.page}/{hits.pages}</Col>
                        <Col xs={2}><Icon.ChevronRight onClick={nextPage}/></Col>
                    </Row>
                </Col>
                <Col className={`mt-3 pl-4`} xs={12}>
                    <input
                        name={`search`}
                        value={search}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        style={{width:"100%"}}/>
                </Col>
            </Row>

        <Row className={"ml-0"}>
            <Col className="ml-0" xs={3}>
                {!ready?(
                    <>
                    <Row className={"ml-0"}>
                        <Col xs={6}>
                            <Spinner size="sm"  animation={"border-0"} variant={"secondary"}/>

                        </Col>
                    </Row>
                        <Row className={"mt-5"}>
                            <Col xs={6}>
                                <Spinner size="sm" animation={"border-0"} variant={"secondary"}/>
                            </Col>
                        </Row>
                    </>
                ):(
                    <Row>
                        <Col className={`border-0 border-0-success p-0`} xs={12}>
                        <FacetGroups
                            groups={results.groups}
                            toggleFilter={toggleFilter}
                            resetFilters={resetFilters}
                            applyFilters={applyFilters}
                            filters={facetFilters}
                        />
                        </Col>

                    </Row>
                )}

            </Col>
            <Col className={`m-0 p-0  `}xs={9}>
                {!ready?(
                    <Spinner animation={"border-0"} variant={"primary"}/>
                ):(
                    <Row className={`  ml-0`}>
                        <Col xs={12}>
                            {
                                hits.nodes.map((hit)=>{

                                    return <HitStyled>
                                        <Row key={hit.datasetUri}>

                                        <Col xs={6} className={` `}>
                                            <Row>
                                                <Col xs={1}>
                                                    <Avatar className={`mr-1`} size={22} round={true} name={hit.label}/>
                                                </Col>
                                                <Col xs={9}>
                                                    <h5>
                                                        <Link to={`/dataset/${hit.datasetUri}/overview`}>
                                                            {hit.label}
                                                        </Link>
                                                    </h5>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={4}>
                                                    <Icon.Table size={12}/> <small>{hit.statistics.tables} tables</small>
                                                </Col>
                                                <Col xs={6}>
                                                    <Icon.Table size={12}/> <small>{hit.statistics.locations} locations</small>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                    <small>
                                                        {hit.description.slice(0,200)}
                                                    </small>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={8}>
                                                    {
                                                        hit.tags.map((tag)=>{
                                                            return <Badge className={'ml-1'} variant={`info`} key={tag}>{tag}</Badge>
                                                        })
                                                    }
                                                </Col>
                                            </Row>

                                        </Col>
                                        <Col className={` `} xs={6}>
                                            <Row>
                                                <Col xs={8}>
                                                    <small>in Org:<b> {hit.organization.label}</b></small>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                    <small>Created by {hit.owner} {dayjs(hit.created).fromNow()}</small>
                                                </Col>
                                            </Row>

                                            <Row className={`mt-2`}>
                                                <Col xs={6}>

                                                    <Zoom scale={'1.1'}>
                                                        <small className={"text-primary"}>Request Access</small>
                                                    </Zoom>
                                                </Col>
                                            </Row>

                                        </Col>

                                    </Row>
                                    </HitStyled>
                                })
                            }
                        </Col>
                    </Row>
                )}
            </Col>
        </Row>
    </Container>
    </FullScreen>
}


export default Catalog;
