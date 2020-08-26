import React, {useState,useEffect} from "react";
import {Container,Spinner,Table, Row, Col, ListGroupItem, ListGroup} from "react-bootstrap";
import Tile from "../../components/Tile/Tile";
import DatasetListItem from "./DatasetListItem";
import {Link,useLocation,useParams,useHistory} from "react-router-dom";
import styled from "styled-components";
import {toast} from "react-toastify";
import useClient from "../../api/client";
import listDatasets from "../../api/Dataset/listDatasets";



const DatasetList = (props)=>{
    let client = useClient();
    let [datasets, setDatasets] = useState({count:0,nodes:[]});
    let [ready, setReady] = useState([]);
    let [search, setSearch] = useState("");
    let [sortCriterias, setSortCriterias] = useState({label : 'asc', created: 'asc'});


    const fetchItems=async ()=>{
        const response = await client.query(listDatasets({
            term:search,
            sort:Object.keys(sortCriterias).map((k)=>{return {field:k, direction:sortCriterias[k]}}),
            roles:['Admin','Owner','ReadWrite']
        }));
        if (!response.errors){
            setDatasets(response.data.listDatasets);
        }else {
            toast.error(`Could not retrieve datasets, received ${response.errors[0].message}`)
        }
    }

    const handleInputChange=(e)=>setSearch(e.target.value);
    const handleSortCriteria=async (field)=>{
        setSortCriterias({
            ...sortCriterias, [field] : sortCriterias[field]=='asc'?'desc':'asc'
        });
        await fetchItems();
    }

    const handleKeyDown=async ()=>{
        await fetchItems();
    }

    useEffect(()=>{
        if (client){
            client
                .query(
                    listDatasets({
                        term:'',
                        //roles:['Admin',"Owner","ReadWrite"]
                        roles:["Owner"]

                    })
                )
                .then((res)=>{
                    console.log(res);
                    setDatasets(res.data.listDatasets);
                    setReady(true);
                })
                .catch((err)=>{
                    console.log("!",err);
                })

        }
    },[client]);

    return <React.Fragment>
        <Container className={""}>
            <Row>
                <Col xs={11}>
                    <h3>My Datasets</h3>
                </Col>
            </Row>
            <Row className={"mt-3"}>
                <Col xs={11}>
                    <input value={search} onKeyDown={handleKeyDown} onChange={handleInputChange} placeholder={"search your datasets"} style={{width:'100%'}}/>
                </Col>
                <Col xs={1}>
                    <Link to={"/newdataset"}>
                        <div className={"btn btn-sm bg-white border"}>Create</div>
                    </Link>
                </Col>
                <Col xs={2}>
                        <i>Found {datasets.count} results</i>
                </Col>
                <Col xs={1}>
                    <small onClick={()=>{handleSortCriteria('created')}}><b>Created</b>({sortCriterias.created})</small>
                </Col>
                <Col xs={1}>
                    <small onClick={()=>{handleSortCriteria('label')}}><b>Name</b>({sortCriterias.label})</small>
                </Col>
            </Row>
            <Row className={"mt-4"}>
                {
                    !(ready)?(
                        <Col>
                        <Spinner variant={"primary"} animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                        </Col>
                    ):(
                        <Col>
                            <Row >
                            {
                                datasets.nodes.map((dataset)=>{
                                    return <Col  className={"mt-1"} key={dataset.datasetUri} xs={6}>
                                            <DatasetListItem  dataset={dataset}/>
                                    </Col>
                                })
                            }
                            </Row>
                        </Col>
                    )
                }
            </Row>

        </Container>
    </React.Fragment>

}


export default DatasetList;
