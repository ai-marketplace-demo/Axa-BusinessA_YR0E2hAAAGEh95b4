import React ,{useState,useEffect} from "react";
import {Container, Table,Row, Badge,Col,Spinner} from "react-bootstrap";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select'
import {Link,useParams,useLocation} from "react-router-dom"

const Background=styled.div`
__height: 25vh;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`



const OrganizationEnvironmentList=(props)=>{

    let params= useParams();
    let location = useLocation();
    let [ready, setReady] = useState(false);
    let [envs,setEnvironments] = useState([]);


    useEffect(()=>{
        setTimeout(()=>{
            setEnvironments([
                {environmentUri:"e1",label:"dev",type : "Data","created": "yesterday",AWSAccountId:'123456789012'},
                {environmentUri:"e2",label:"int",type : "Compute","created": "yesterday",AWSAccountId:'34567890123'},
                {environmentUri:"e3",label:"prod",type : "Data","created": "yesterday",AWSAccountId:'45678901234'},
            ])
            setReady(true);
        },1000);
    },[])

    return <Container>
        <Row>
            <Col xs={1}>
                <Row>
                    <Col className="text-left" xs={12}>
                        <Link style={{color:"black"}} to={`/organizations`}><Icon.ChevronLeft size={36}/></Link>
                    </Col>
                </Row>
            </Col>
            <Col xs={10}>
                <h3>  Environments in Organization <b className={"text-primary"}>{location.state.label.toUpperCase()}</b></h3>
            </Col>
        </Row>
        <Row className={"mt-4"}>
            <Col xs={1}/>
            <Col xs={5}>
                <input placeholder={'search environments'} style={{width:"100%"}}/>
            </Col>
            <Col xs={4}/>
            <Col xs={2}>
                <div className={"btn border btn-sm btn-white"}>
                    <Link
                        style={{color:'black'}}
                        to={{
                            state: location.state,
                            pathname:`/newenvironment/${params.uri}`
                        }}><Icon.Plus size={18}/> Link</Link>
                </div>
            </Col>
        </Row>
        <Row className={"mt-4"}>
            <Col xs={1}/>
            <Col xs={11}>
                {
                    (!ready)?(
                        <Spinner variant="primary" animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>

                    ):(
                        <Background>
                            <Table className="border-0" size="sm"    >

                                <tbody>
                                {envs.map((environment)=>{
                                    return <tr key={environment.environmentUri}>
                                        <td>
                                            <Icon.Cloud style={{border:'solid 1px ', borderRadius:'50%'}}/>


                                            <Link
                                                style={{color:'black'}}
                                                className={`text-capitalize pt-2 pl-2`}
                                                to={{
                                                    state:{
                                                        environment : environment,
                                                        organization : location.state
                                                    },
                                                    pathname:`/environment/${environment.environmentUri}/permissions`
                                                }}>{environment.label}</Link>


                                        </td>
                                        <td>
                                            aws:<code>{environment.AWSAccountId}</code>
                                        </td>
                                        <td>{environment.created}</td>
                                        <td>
                                            <div className={"btn-environment"}>
                                                <Link
                                                    style={{color:'black'}}
                                                    to={{
                                                        state:{
                                                            organization: location.state,
                                                            environment: environment
                                                        },
                                                        pathname:`/editenvironment/${environment.environmentUri}`
                                                    }}
                                                    >
                                                <div className={"ml-1 bg-white border btn btn-sm"}> edit</div>
                                                </Link>
                                            </div>
                                        </td>
                                        <td>
                                            <Link
                                                style={{color:'black'}}
                                                className={` pt-2 pl-2`}
                                                to={{
                                                    state:{
                                                        environment : environment,
                                                        organization : location.state
                                                    },
                                                    pathname:`/environment/${environment.environmentUri}/permissions`
                                                }}><btn className="btn-sm btn bg-white border">permissions</btn></Link>
                                        </td>
                                        <td>
                                            <div className={"btn-environment"}>
                                                <div className={"ml-1 bg-white border btn btn-sm"}> unlink</div>
                                            </div>
                                        </td>

                                    </tr>
                                })}
                                </tbody>
                            </Table>
                        </Background>
                    )
                }
            </Col>

        </Row>
    </Container>
}


export default OrganizationEnvironmentList;
