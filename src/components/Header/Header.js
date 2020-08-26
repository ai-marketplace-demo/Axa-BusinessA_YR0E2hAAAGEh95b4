import React, {useEffect,useState} from "react";
import {If, Then, Else, Switch, Case} from "react-if";
import Search from "../Search/Search";
import Zoom from "../Zoomer/Zoom";
import {Link} from "react-router-dom";
import {Container,Row, Col, Spinner} from "react-bootstrap"
import Avatar from 'react-avatar';
import * as Icon from "react-bootstrap-icons";
import useClient from "../../api/client";
import useAuth from "../../hooks/useAuth";
import { Auth } from 'aws-amplify';
import config from "../../config";
import styled from "styled-components";
import SearchResources from "../../api/Search/searchResources"
import BootstrapTable from 'react-bootstrap-table-next';
import {toast} from "react-toastify";

const SearchResultStyled=styled.div`
z-index:9999;
__border-radius: 11px;
position: absolute;
padding-left: 5%;
padding-right: 5%;
width : 98%;
padding-top: 3%;
background-color: white;
height:200vh;
box-shadow: 0px 0px 6px lightgray;
border : 1px solid lightgrey;
`


const SearchResultPanel = function(props){
    const client = useClient();
    const [ready, setReady] = useState(false);
    const [results, setResults]= useState({
        count:0,
        page : 1,
        pages: 1,
        hasNext : false,
        hasPrevious: false,
        nodes:[]
    })

    const typeFormatter=(cell, row)=>{
        return <Switch>
            <Case condition={row.objectType=="organization"}>
                <Icon.Gear/> {cell}
            </Case>
            <Case condition={row.objectType=="environment"}>
                <Icon.Cloud/> {cell}
            </Case>
            <Case condition={row.objectType=="dashboard"}>
                <Icon.BarChartLine/> {cell}
            </Case>
            <Case condition={row.objectType=="dataset"}>
                <Icon.Folder/> {cell}
            </Case>
            <Case condition={row.objectType=="project"}>
                <Icon.FileCode/> {cell}
            </Case>

        </Switch>
    }

    const linkFormatter=(cell, row)=>{

        return <Switch>
            <Case condition={row.objectType=="organization"}>
                <Link target={"_blank"} to={`/organization/${row.objectUri}/dashboard`}>
                    {cell}
                </Link>
            </Case>
            <Case condition={row.objectType=="environment"}>
                <Link target={"_blank"} to={`/playground/${row.objectUri}`}>
                    {cell}
                </Link>
            </Case>
            <Case condition={row.objectType=="dashboard"}>
                <Link target={"_blank"} to={`/dashboard/${row.objectUri}`}>
                    {cell}
                </Link>
            </Case>

            <Case condition={row.objectType=="dataset"}>
                <Link target={"_blank"} to={`/dataset/${row.objectUri}`}>
                    {cell}
                </Link>
            </Case>
            <Case condition={row.objectType=="project"}>
                <Link target={"_blank"} to={`/project/${row.objectUri}`}>
                    {cell}
                </Link>
            </Case>

        </Switch>
    }
    const columns = [
        {
            dataField: 'objectType',
            text: 'Resource Type',
            style:{width:'10ch'},
            formatter: typeFormatter

        },
        {
            dataField: 'label',
            text: 'Name',
            formatter:linkFormatter,
        },
        {
            dataField: 'description',
            text: 'Summary'
        },
    ]

    const fetchResults=async ()=>{
        const response  = await client.query(SearchResources({term:props.term}));
        if (!response.errors){
            console.log(response.data)
            setResults({...response.data.searchResources});
            setReady(true);
        }else {
            toast(`search did not work ${response.errors[0].message}`)
        }
    }

    const nextPage=()=>{
        if (results.hasNext){
            setResults({...results, page:results.page+1})
        }
    }

    const prevPage=()=>{
        if (results.hasPrevious){
            setResults({...results, page:results.page-1})
        }
    }

    useEffect(()=> {
        if (client) {
            fetchResults();
        }
    },[client, results.page])

    if (!ready){
        return <Spinner animate={"border"} variant={"primary"}/>
    }
    return <SearchResultStyled>
        <If condition={results.count>0}>
            <Then>
                <Container>
                    <Row>
                        <Col xs={4}>
                            Found {results.count} results for search <b>{props.term}</b>
                        </Col>
                        <Col xs={4}>
                            <Row>
                                <Col className={`pt-1 text-right`} xs={4}>
                                    <Icon.ChevronLeft/>
                                </Col>
                                <Col className={`text-center`} xs={4}>Page {results.page}/{results.pages}</Col>
                                <Col className={`pt-1 text-left`} xs={4}>
                                    <Icon.ChevronRight/>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={2}/>
                        <Col className={`text-right`} xs={2}>
                            <Icon.X onClick={()=>{props.close&&props.close()}} size={26}/>
                        </Col>
                    </Row>
                    <Row className={`mt-4`}>
                        <Col xs={12}>
                            <BootstrapTable
                                rowStyle={{height:'15px',fontSize:'13px'}}
                                hover
                                condensed
                                bordered={ false }
                                keyField='uri'
                                data={ results.nodes}
                                columns={ columns }
                            />
                        </Col>
                    </Row>
                </Container>

            </Then>
            <Else>
                <Row>
                    <Col xs={1}></Col>
                    <Col xs={8}>
                        <h5><i>No results found</i></h5>
                    </Col>
                </Row>

            </Else>
        </If>


    </SearchResultStyled>

}

const Header=(props)=>{


    const [displaySearchResults, setDisplaySearchResults]=useState(false);
    const [term, setTerm] = useState('')
    const [userInfo, setUserInfo] = useState(null);
    //let email=(userInfo)?userInfo.attributes.email:"";
    //let name=(userInfo)?userInfo.username:"";
    let client = useClient();
    let auth = useAuth();
    const fetchUserInfoBack = async()=>{
        if(!userInfo){
            //const currentUser = await Auth.currentAuthenticatedUser();
            const currentUser = await Auth.currentAuthenticatedUser();
            console.log("currentAuthenticatedUser" , currentUser)
            //alert(JSON.stringify(currentUser))
            setUserInfo(currentUser);
        }
    };


    const signOut=()=>{
        const tokenName= `datahub-token-${config.cognito.APP_CLIENT_ID}`;
        let token = localStorage.getItem(tokenName)
        if (token){
            localStorage.removeItem(tokenName)
        }
        document.location.href= config.cognito.SIGNOUT_URL;
    }

    const fetchUserInfo = ()=>{
        console.log("AUTH  === ");
        console.log(auth)
        setUserInfo(auth);
    }

    useEffect(() => {
        if(!userInfo){
            fetchUserInfo();
        }
    }, [auth]);

    const onSearchTermChange=(searchTerm)=>{
        setTerm(searchTerm)
    }
    const refreshSearch=(searchTerm)=>{
        setDisplaySearchResults(true);
    }
    //return <h1>{JSON.stringify(userInfo)}</h1>
    if (!userInfo){
        return <div/>
    }
    return <Container>

        <Row>

        <Col xs={3}>
            <Row>
                <Col xs={12}><h3>[d]atahub</h3></Col>
                <Col xs={12}>
                    <p>simplified cloud analytics</p>
                </Col>
            </Row>
        </Col>
        <Col className={"pt-2"} xs={4}>
            <Search placeholder={'search anything'}
                    reset={()=>{setDisplaySearchResults(false)}}
                    onChange={onSearchTermChange}
                    submit={refreshSearch} />
        </Col>
        <Col className={"pt-2"} xs={1}>
            <Link to={`getstarted`}>
            <Zoom origin={"center"} color={`blue`} scale={1.1}>
                <Avatar textMarginRatio={0.41} color={"lightblue"} size={32} round="50%" value={"+"}></Avatar>
            </Zoom>
            </Link>
        </Col>
        <Col xs={3} className={"pt-2 text-4xl"} >
                <Zoom color={`blue`}>
                    {/**<Avatar color={"lightblue"} size={36} round="50%" name={userInfo.email||'un'}></Avatar>**/}
                    <Link to={`/profile`}>
                        {userInfo.email}
                    </Link>
                </Zoom>
        </Col>
        <Col xs={1} className={"pt-3 text-3xl"}>
            <Icon.ArrowBarRight size={22} onClick={signOut}/>
        </Col>
    </Row>
    <Row>

        <If condition={displaySearchResults}>
            <Then>
                <Col xs={12}>
                    <SearchResultPanel
                        term={term}
                        close={()=>{
                            setDisplaySearchResults(false)}
                        }
                    />
                </Col>
            </Then>
        </If>
    </Row>

    </Container>
};

export default Header;
